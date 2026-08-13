#!/usr/bin/env node
// AI Front-end Harness — 품질 루프.
// 정적 분석(ESLint) 리포트 → AI 개선 → 재검증을 반복한다.
// SonarQube를 쓰는 파이프라인도 리포트 JSON을 같은 방식으로 넘기면 동일하게 동작한다.
//
// 사용법: npm run quality-fix [-- <경로>]   (기본 대상: src)
// 필요:   ANTHROPIC_API_KEY 환경변수

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = "claude-opus-4-8";
const MAX_ITERATIONS = 3;
const target = process.argv[2] || "src";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY 환경변수가 필요합니다. 예:\n  export ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

const standards = ["component-authoring", "testing", "code-review"]
  .map((s) => `## ${s}\n${readFileSync(join(root, "standards", `${s}.md`), "utf8")}`)
  .join("\n\n");

const client = new Anthropic();

const applyFixesTool = {
  name: "apply_fixes",
  description: "정적 분석 지적을 개선한 파일들의 전체 내용을 제출한다.",
  input_schema: {
    type: "object",
    properties: {
      files: {
        type: "array",
        description: "수정한 파일 목록 (변경이 필요한 파일만)",
        items: {
          type: "object",
          properties: {
            path: { type: "string", description: "저장소 루트 기준 상대 경로 (예: src/components/Button/Button.tsx)" },
            content: { type: "string", description: "수정된 파일 전체 내용" },
          },
          required: ["path", "content"],
        },
      },
      notes: {
        type: "string",
        description: "표준과 충돌해 반영하지 않은 지적이 있으면 근거를 남긴다 (선택).",
      },
    },
    required: ["files"],
  },
};

const system = `당신은 이 저장소의 품질 개선 에이전트다.
ESLint 정적 분석 리포트를 받아 개발 표준에 맞게 코드를 개선한다.

규칙:
- 동작(behavior)을 바꾸지 않는 범위에서 개선한다.
- 표준과 충돌하는 지적은 반영하지 말고 notes에 근거를 남긴다.
- 수정한 파일은 전체 내용을 apply_fixes로 제출한다 (변경이 필요한 파일만).

# 개발 표준
${standards}`;

function lint() {
  try {
    const out = execFileSync("npx", ["eslint", target, "--format", "json"], {
      cwd: root,
      encoding: "utf8",
    });
    return JSON.parse(out);
  } catch (e) {
    // ESLint는 지적이 있으면 exit 1이지만 JSON은 stdout에 출력한다.
    if (e.stdout) {
      try {
        return JSON.parse(e.stdout);
      } catch {
        /* fallthrough */
      }
    }
    console.error("ESLint 실행 실패:", e.stderr || e.message);
    process.exit(1);
  }
}

function toFindings(results) {
  const list = [];
  for (const r of results) {
    for (const m of r.messages) {
      list.push({
        file: relative(root, r.filePath),
        line: m.line,
        ruleId: m.ruleId ?? "(parse)",
        severity: m.severity === 2 ? "error" : "warn",
        message: m.message,
      });
    }
  }
  return list;
}

for (let i = 1; i <= MAX_ITERATIONS; i++) {
  const findings = toFindings(lint());

  if (findings.length === 0) {
    console.log(
      i === 1
        ? "표준 위반 없음 — 개선할 항목이 없습니다."
        : `\n✓ 모든 지적 해소 (${i - 1}회 반복).`,
    );
    process.exit(0);
  }

  console.log(`\n[반복 ${i}/${MAX_ITERATIONS}] ESLint 지적 ${findings.length}건`);
  for (const f of findings.slice(0, 20)) {
    console.log(`  ${f.severity} ${f.file}:${f.line} ${f.ruleId} — ${f.message}`);
  }

  const affected = [...new Set(findings.map((f) => f.file))];
  const fileBlocks = affected
    .map((p) => `### ${p}\n\`\`\`tsx\n${readFileSync(join(root, p), "utf8")}\n\`\`\``)
    .join("\n\n");
  const findingsText = findings
    .map((f) => `- [${f.severity}] ${f.file}:${f.line} (${f.ruleId}): ${f.message}`)
    .join("\n");

  console.log("  개선안 생성 요청...");
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system,
    tools: [applyFixesTool],
    tool_choice: { type: "tool", name: "apply_fixes" },
    messages: [
      {
        role: "user",
        content: `아래는 ESLint 정적 분석 리포트다:\n\n${findingsText}\n\n대상 파일 현재 내용:\n\n${fileBlocks}\n\n표준을 기준으로 지적을 개선한 파일 전체 내용을 apply_fixes로 제출하라.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse) {
    console.error("모델이 수정안을 제출하지 않았습니다.");
    process.exit(1);
  }
  if (toolUse.input.notes) {
    console.log("  모델 노트:", toolUse.input.notes);
  }

  for (const f of toolUse.input.files) {
    const abs = resolve(root, f.path);
    if (!abs.startsWith(root)) {
      console.warn("  경로 이탈 무시:", f.path);
      continue;
    }
    writeFileSync(abs, f.content);
    console.log("  수정 적용:", f.path);
  }
  console.log("  재검증...");
}

const remaining = toFindings(lint());
if (remaining.length === 0) {
  console.log("\n✓ 모든 지적 해소.");
  process.exit(0);
}
console.error(`\n✗ ${MAX_ITERATIONS}회 반복 후에도 ${remaining.length}건 남았습니다.`);
process.exit(1);
