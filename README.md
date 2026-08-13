# AI Front-end Harness

[![CI](https://github.com/kangji92/ai-fe-harness/actions/workflows/ci.yml/badge.svg)](https://github.com/kangji92/ai-fe-harness/actions/workflows/ci.yml)

> Markdown 개발 표준을 **AI 에이전트가 읽고**, 컴포넌트·테스트를 **일관되게 생성**하는 프론트엔드 개발 하네스.

AI 코드 생성은 빠르지만, 표준이 없으면 결과물이 사람마다·세션마다 제각각이 됩니다. 이 하네스는 **"AI가 따라야 할 규칙(Markdown)"** 과 **"그 규칙대로 생성·검증하는 파이프라인"** 을 코드로 고정해, 생성형 AI의 생산성을 *일관성 있게* 만드는 것을 목표로 합니다.

## 왜 하네스인가

| 문제 | 하네스의 해법 |
|------|--------------|
| AI 생성물이 컨벤션을 벗어남 | `standards/` — Markdown 개발 표준을 단일 진실 소스로 |
| 매번 프롬프트를 새로 씀 | `prompts/` — 재사용 프롬프트 라이브러리 |
| 골격 작성이 반복·불일치 | `scripts/scaffold.mjs` — 표준을 강제하는 스캐폴더 |
| 생성 코드 품질 미검증 | 컴포넌트마다 테스트 동반 + CI 자동 실행 |

## 구성

```
ai-fe-harness/
├─ AGENTS.md              # AI 에이전트 운영 지침 (작업 규칙)
├─ standards/             # Markdown 개발 표준 (single source of truth)
│  ├─ component-authoring.md
│  ├─ testing.md
│  ├─ storybook.md
│  ├─ commit-conventions.md
│  └─ code-review.md
├─ prompts/               # 재사용 프롬프트 (컴포넌트·테스트·품질 루프)
├─ templates/component/   # 표준을 반영한 스캐폴드 템플릿
├─ scripts/scaffold.mjs   # 표준을 강제하는 결정적 스캐폴더
├─ scripts/agent-generate.mjs  # 실행 에이전트 루프 (Claude 호출 → 생성 → 테스트 → 자가수정)
├─ scripts/quality-fix.mjs     # 품질 루프 (ESLint 리포트 → AI 개선 → 재검증)
├─ src/components/        # 하네스 산출물 예시 (Button = 확장본 / Card = 원본 출력)
└─ .github/workflows/     # CI — 생성된 테스트 자동 검증
```

## 워크플로우

1. **골격 생성** — 스캐폴더가 표준 준수 컴포넌트+테스트를 만든다
   ```bash
   npm run scaffold -- Button
   ```
2. **AI 반영** — 에이전트가 `AGENTS.md` + `standards/` + `prompts/`를 읽고 요구사항을 구현
3. **자동 검증** — `npm test`, `npm run typecheck`
4. **품질 루프** — SonarQube/ESLint 결과를 프롬프트로 넘겨 개선안 생성 → 반영 → 재검증 (`prompts/quality-loop.md`)

## 빠른 시작

```bash
npm install
npm run scaffold -- MyComponent   # 컴포넌트 + 테스트 + 스토리(CSF3) + index 생성
npm test                          # 검증
```

## 실행 에이전트 (Agentic Loop)

스캐폴더가 "결정적 골격 생성"이라면, **에이전트 루프**는 실제로 Claude를 호출해
표준을 읽고 **요구사항까지 반영·검증·자가수정**한다.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run agent -- Badge "상태를 색상으로 표시하는 배지. variant: success | warning | danger."
```

내부 흐름:

1. `standards/`(Markdown 표준)를 시스템 프롬프트로 주입
2. Claude(`claude-opus-4-8`)가 `submit_files` **도구 호출**로 파일을 제출 (구조화 출력 강제)
3. 생성 파일을 기록하고 **`vitest run`으로 즉시 검증**
4. 실패하면 테스트 로그를 모델에 되돌려 **최대 3회까지 자가 수정**
5. 통과하면 종료

> 표준(`standards/`) · 프롬프트 · 스캐폴더 · **실행 루프**가 한 저장소에서 맞물려,
> "AI 코드 생성"을 문서가 아니라 **검증되는 파이프라인**으로 만든다.

## 품질 루프 (Quality Loop)

정적 분석 리포트를 AI 개선 사이클로 연결한다. "리포트 → AI 개선 → 재검증"이 한 사이클.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run quality-fix           # 대상 기본값: src
```

내부 흐름:

1. `eslint <target> --format json`으로 지적을 수집
2. 지적 + 대상 파일을 표준과 함께 Claude에 전달
3. `apply_fixes` 도구로 개선된 파일을 받아 적용 (표준과 충돌하는 지적은 근거와 함께 보류)
4. **다시 lint**해서 지적이 줄었는지 검증, 최대 3회 반복

> SonarQube를 쓰는 파이프라인도 리포트 JSON을 같은 방식으로 넘기면 동일하게 동작한다.

## 이 하네스가 증명하는 것

- **Markdown 기반 개발 표준 수립** — `standards/`, `AGENTS.md`
- **AI Agent 활용 개발 프로세스** — 에이전트가 표준을 읽고 생성·검증하는 흐름
- **테스트 자동화 체계** — 컴포넌트당 테스트 + CI
- **생성형 AI 생산성** — 프롬프트 라이브러리 + 스캐폴더로 반복 제거

## 생산성 회고 (측정 템플릿)

| 작업 | 하네스 이전 | 하네스 이후 |
|------|------------|------------|
| 컴포넌트+테스트 골격 | (수기 N분) | `scaffold` 수초 |
| 컨벤션 편차 | 리뷰에서 반복 지적 | 표준으로 사전 차단 |
| 테스트 누락 | 종종 발생 | 골격에 기본 포함 |

## Dogfooding

이 접근(Markdown 표준 + AI 에이전트 + 테스트 자동화)을 실제 포트폴리오 구축에 적용했습니다 → [kangji92/portfolio](https://github.com/kangji92/portfolio)

## 로드맵

- [x] 실행 에이전트 루프 (스펙 → 생성 → 테스트 → 자가수정)
- [x] 품질 루프 (정적 분석 → AI 개선 → 재검증)
- [x] Storybook 스토리 자동 생성 (CSF3 템플릿)
- [ ] Playwright E2E 시나리오 생성 프롬프트
