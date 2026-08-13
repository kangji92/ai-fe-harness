# 테스트 표준

## 원칙

- **모든 컴포넌트는 최소 1개의 렌더 테스트**를 가진다 (스캐폴드 골격에 기본 포함).
- **사용자 관점**으로 검증한다 — Testing Library의 role·label 기반 쿼리 사용
  (`getByRole`, `getByLabelText`). 구현 세부(클래스명·내부 상태)에 의존하지 않는다.
- 상호작용은 `fireEvent` / `userEvent`로 검증한다.
- 커버리지 목표는 **80% 이상**.

## 무엇을 테스트하나

- 렌더링: 필수 콘텐츠·역할이 나타나는가
- 상호작용: 클릭·입력 시 콜백/상태가 기대대로 동작하는가
- 조건부: variant·disabled 등 분기별 동작
- 경계: 빈 값·비활성 등 엣지 케이스

## 예시

`src/components/Button/Button.test.tsx` 참고 — 렌더 · 클릭 · variant · disabled 4개 시나리오.
