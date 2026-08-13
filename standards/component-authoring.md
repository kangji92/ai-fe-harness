# 컴포넌트 작성 표준

AI 에이전트와 개발자가 컴포넌트를 만들 때 따르는 규칙.

## 파일·폴더

- 폴더 구조: `src/components/<Name>/{<Name>.tsx, <Name>.test.tsx, index.ts}`
- 컴포넌트·파일명은 **PascalCase** (예: `UserCard`)
- `index.ts`에서 `export * from "./<Name>"`

## Props

- **명시적 인터페이스**로 정의: `export interface <Name>Props { ... }`
- `any` 금지. 유니온·제네릭으로 정확히 표현
- 선택 props는 기본값을 구조 분해에서 지정 (`variant = "primary"`)

## 접근성

- 시맨틱 태그 우선 (`button`, `nav`, `ul` …)
- 인터랙티브 요소는 role·aria·label을 갖춘다
- 키보드 접근성 고려 (focusable, Enter/Space)

## 구현

- 부수효과는 이벤트 핸들러 / effect로 분리, 렌더 중 상태 변경 금지
- 스타일은 클래스 기반. 인라인 스타일은 동적 값에 한해 최소화
- 한 파일이 커지면 책임 단위로 분리
