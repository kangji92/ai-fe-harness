# AI Front-end Harness

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
│  ├─ commit-conventions.md
│  └─ code-review.md
├─ prompts/               # 재사용 프롬프트 (컴포넌트·테스트·품질 루프)
├─ templates/component/   # 표준을 반영한 스캐폴드 템플릿
├─ scripts/scaffold.mjs   # 표준을 코드로 강제하는 스캐폴더 (하네스 엔트리포인트)
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
npm run scaffold -- MyComponent   # 컴포넌트 + 테스트 + index 생성
npm test                          # 검증
```

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

- [ ] Storybook 스토리 자동 생성 템플릿
- [ ] Playwright E2E 시나리오 생성 프롬프트
- [ ] SonarQube 리포트 → AI 개선 PR 자동화 스크립트
