#!/usr/bin/env node
// AI Front-end Harness — 실행 에이전트 루프.
// 스펙 → Claude 생성 → 파일 작성 → 테스트 → 실패 시 자가 수정 → 반복.
//
// 사용법: npm run agent -- <ComponentName> "<요구사항 설명>"
// 필요:   ANTHROPIC_API_KEY 환경변수
//
// 스캐폴더(scaffold.mjs)가 "표준을 강제하는 결정적 골격 생성"이라면,
// 이 스크립트는 "표준을 읽고 요구사항까지 반영·검증하는 실행 에이전트"다.

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = "claude-opus-4-8";
const MAX_ITERATIONS = 3;

const name = process.argv[2];
const spec = process.argv.slice(3).join(" ").trim();

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name) || !spec) {
  console.error('사용법: npm run agent -- <ComponentName> "<요구사항 설명>"  (이름은 PascalCase)');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "ANTHROPIC_API_KEY 환경변수가 필요합니다. 예:\n  export ANTHROPIC_API_KEY=sk-ant-...",
  );
  process.exit(1);
}

// 개발 표준(Markdown)을 컨텍스트로 주입 — AGENTS.md의 "standards가 단일 진실 소스" 원칙.
const standards = ["component-authoring", "testing", "storybook"]
  .map((s) => `## ${s}\n${readFileSync(join(root, "standards", `${s}.md`), "utf8")}`)
  .join("\n\n");

const client = new Anthropic();
const targetDir = join(root, "src", "components", name);

// 파일 제출을 도구 호출로 강제 → 신뢰성 있는 구조화 출력.
const submitFilesTool = {
  name: "submit_files",
  description:
    "생성한 컴포넌트 파일을 제출한다. <Name>.tsx, <Name>.test.tsx, <Name>.stories.tsx, index.ts 네 파일을 포함해야 한다.",
  input_schema: {
    type: "object",
    properties: {
      files: {
        type: "array",
        description: "생성할 파일 목록",
        items: {
          type: "object",
          properties: {
            filename: { type: "string", description: "파일명 (예: Button.tsx)" },
            content: { type: "string", description: "파일 전체 내용" },
          },
          required: ["filename", "content"],
        },
      },
    },
    required: ["files"],
  },
};

const system = `당신은 이 저장소의 프론트엔드 개발 하네스에서 동작하는 AI 에이전트다.
아래 개발 표준을 반드시 준수해 React + TypeScript 컴포넌트와 Vitest + Testing Library 테스트를 생성한다.
결과물은 반드시 submit_files 도구로 제출한다.

- 파일은 <Name>.tsx, <Name>.test.tsx, <Name>.stories.tsx, index.ts 네 개.
- props는 명시적 인터페이스로 정의하고 any를 쓰지 않는다.
- 테스트는 사용자 관점(role/label 쿼리)과 상호작용을 검증한다.
- 스토리는 CSF3 형식으로 주요 상태·variant를 노출한다.

# 개발 표준
${standards}`;

const messages = [
  {
    role: "user",
    content: `컴포넌트 이름: ${name}\n요구사항: ${spec}\n\n표준을 준수해 컴포넌트 + 테스트 + index를 만들고 submit_files로 제출하라.`,
  },
];

function writeFiles(files) {
  mkdirSync(targetDir, { recursive: true });
  for (const f of files) {
    writeFileSync(join(targetDir, f.filename), f.content);
    console.log("  파일 작성:", `src/components/${name}/${f.filename}`);
  }
}

function runTests() {
  try {
    const output = execFileSync("npx", ["vitest", "run", `src/components/${name}`], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    });
    return { ok: true, output };
  } catch (e) {
    return { ok: false, output: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

for (let i = 1; i <= MAX_ITERATIONS; i++) {
  console.log(`\n[반복 ${i}/${MAX_ITERATIONS}] Claude(${MODEL})에 생성 요청...`);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system,
    tools: [submitFilesTool],
    tool_choice: { type: "tool", name: "submit_files" },
    messages,
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse) {
    console.error("모델이 파일을 제출하지 않았습니다.");
    process.exit(1);
  }

  writeFiles(toolUse.input.files);

  console.log("  테스트 실행...");
  const result = runTests();
  if (result.ok) {
    console.log(`\n✓ ${name} 생성 및 테스트 통과 (${i}회 반복).`);
    process.exit(0);
  }

  console.log("  테스트 실패 — 실패 로그를 모델에 전달해 자가 수정...");
  messages.push({ role: "assistant", content: response.content });
  messages.push({
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: toolUse.id,
        is_error: true,
        content: `테스트가 실패했습니다. 아래 출력을 참고해 파일을 수정하고 다시 submit_files로 제출하세요:\n\n${result.output.slice(-4000)}`,
      },
    ],
  });
}

console.error(`\n✗ ${MAX_ITERATIONS}회 반복 안에 테스트를 통과하지 못했습니다.`);
process.exit(1);
