# E2E(Playwright) 작성 표준

사용자 플로우를 브라우저에서 검증하는 E2E 테스트 규칙.

## 파일·구조

- 한 파일 = **하나의 사용자 플로우** (`e2e/<flow>.spec.ts`)
- 구조는 **Arrange(이동) → Act(상호작용) → Assert(관찰 가능한 결과)**

## 셀렉터

- **role · label · text 기반**으로 요소를 찾는다 (`getByRole`, `getByLabel`, `getByText`).
- CSS 클래스·`data-testid` 남발·구현 세부에 의존하는 셀렉터는 지양한다.

## 검증

- 사용자가 실제로 **하는 행위와 확인하는 결과**만 검증한다 (내부 상태·구현 세부 금지).
- 관찰 가능한 결과(화면에 보이는 텍스트·요소·URL)를 단언한다.

## 대기

- Playwright의 **자동 대기(auto-waiting)**에 의존한다. 임의의 `sleep`/고정 지연 금지.

## 참고

- 예시: `examples/e2e/auth.spec.ts` (참고용 — 실행하려면 `@playwright/test` 설치 + 브라우저 필요)
- 이 하네스는 Playwright 런타임을 설치하지 않는다(의존성 최소화). 스펙은 표준·프롬프트로 산출하고,
  실제 실행은 Playwright를 도입한 프로젝트에서 `npx playwright test`로 수행한다.
