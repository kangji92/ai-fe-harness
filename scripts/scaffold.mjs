#!/usr/bin/env node
// AI Front-end Harness — 컴포넌트 스캐폴더.
// templates/component/의 __NAME__ 토큰을 치환해 컴포넌트 + 테스트 + index를 생성한다.
// 사용법: npm run scaffold -- <ComponentName>   (PascalCase)

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const name = process.argv[2];
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("사용법: npm run scaffold -- <ComponentName>  (PascalCase 예: Button)");
  process.exit(1);
}

const templateDir = join(root, "templates", "component");
const targetDir = join(root, "src", "components", name);

if (existsSync(targetDir)) {
  console.error(`이미 존재합니다: src/components/${name}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

for (const file of readdirSync(templateDir)) {
  const content = readFileSync(join(templateDir, file), "utf8").replaceAll(
    "__NAME__",
    name,
  );
  const outName = file.replaceAll("__NAME__", name);
  writeFileSync(join(targetDir, outName), content);
  console.log("생성:", `src/components/${name}/${outName}`);
}

console.log(
  `\n✓ ${name} 컴포넌트 + 테스트 생성 완료. 'npm test'로 검증하세요.`,
);
