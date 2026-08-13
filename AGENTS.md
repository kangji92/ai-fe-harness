# AGENTS.md

이 저장소에서 AI 에이전트(Claude Code · Codex 등)가 작업할 때 따르는 운영 지침입니다.
사람이 읽어도 되지만, **1차 독자는 AI 에이전트**입니다.

## 원칙

- `standards/`를 **단일 진실 소스**로 삼는다. 코드를 생성하기 전에 관련 standard를 읽는다.
- 컴포넌트 생성은 **반드시 스캐폴더로 시작**한다 — 수기로 파일을 만들지 않는다.
  ```bash
  npm run scaffold -- <ComponentName>
  ```
- 모든 컴포넌트는 **테스트를 동반**한다 (`standards/testing.md`).
- 작업을 마치면 `npm test`와 `npm run typecheck`를 **통과**시킨다.
- 커밋은 `standards/commit-conventions.md`를 따른다.

## 표준 작업 흐름

1. 요구사항 분석 → 관련 standard 확인
2. `npm run scaffold`로 골격 생성
3. 요구사항 반영 (props · 상태 · 접근성)
4. 테스트 보강 → `npm test`
5. 자기 리뷰 (`standards/code-review.md` 체크리스트)

## 실행 에이전트 루프

`scripts/agent-generate.mjs`는 이 표준을 실제로 구동하는 루프다: Claude가 `standards/`를 읽고
`submit_files` 도구로 파일을 제출하면, 하네스가 `vitest`로 검증하고 실패 시 로그를 되돌려
자가 수정을 반복한다. `npm run agent -- <Name> "<요구사항>"` (ANTHROPIC_API_KEY 필요).

## 품질 루프

정적 분석(SonarQube · ESLint) 결과를 `prompts/quality-loop.md` 형식으로 에이전트에 넘겨
개선안을 생성 → 반영 → 재검증한다. "리포트 → AI 개선 → 재검증"을 한 사이클로 본다.

## 하지 말 것

- 표준을 우회한 임의 컨벤션 도입
- 테스트 없는 컴포넌트 커밋
- `any` 타입 남용 (`standards/component-authoring.md`)
