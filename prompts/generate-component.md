# 프롬프트: 컴포넌트 생성

재사용 프롬프트. `{{ }}` 부분을 채워 AI 에이전트에 전달한다.

---

`standards/component-authoring.md`와 `standards/testing.md`를 먼저 읽어라.

다음 컴포넌트를 만들어라:

- 이름: `{{ComponentName}}` (PascalCase)
- 역할: `{{한 줄 설명}}`
- Props: `{{props 목록과 타입}}`
- 상호작용/상태: `{{동작}}`
- 접근성 요구사항: `{{role/label 등}}`

절차:

1. `npm run scaffold -- {{ComponentName}}`로 골격을 생성한다.
2. 요구사항에 맞게 props·구현을 채운다 (표준 준수, `any` 금지).
3. `standards/testing.md`에 따라 테스트를 보강한다 (렌더·상호작용·분기·엣지).
4. `npm test`와 `npm run typecheck`를 통과시킨다.
5. `standards/code-review.md` 체크리스트로 자기 리뷰 후 요약한다.
