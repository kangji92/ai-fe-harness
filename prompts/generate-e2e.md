# 프롬프트: E2E 시나리오 생성

Playwright E2E 스펙을 사용자 플로우 설명으로부터 생성한다. `{{ }}`를 채워 AI 에이전트에 전달한다.

---

`standards/e2e.md`를 먼저 읽어라.

다음 사용자 플로우에 대한 Playwright E2E 스펙을 작성하라:

- 플로우 이름: `{{flow-name}}` (예: login, checkout)
- 시작 URL: `{{start-url}}`
- 사용자 단계: `{{단계 나열 — 클릭·입력·이동}}`
- 기대 결과: `{{검증할 관찰 가능한 결과 — 보이는 텍스트/요소/URL}}`

규칙:

1. `e2e/{{flow-name}}.spec.ts`에 스펙을 작성한다.
2. 셀렉터는 **role · label · text 기반**(`getByRole`, `getByLabel`, `getByText`)으로 쓴다.
3. 구조는 **Arrange → Act → Assert**. 임의 `sleep` 없이 자동 대기에 의존한다.
4. 사용자가 실제로 하는 행위와 확인하는 결과만 검증한다.
5. 작성 후 `npx playwright test e2e/{{flow-name}}.spec.ts`로 검증하고 결과를 요약한다.
