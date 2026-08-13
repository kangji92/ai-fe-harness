# 스토리(Storybook) 작성 표준

모든 컴포넌트는 **CSF3(Component Story Format 3)** 스토리를 동반한다.

## 형식

- 파일: `src/components/<Name>/<Name>.stories.tsx`
- `default export` = meta (`title`, `component`)
- 명명 export = 개별 스토리 (`args`로 props 지정)
- `title`은 `Components/<Name>` 규칙

## 규칙

- 주요 상태·variant마다 스토리를 하나씩 (예: `Primary`, `Secondary`, `Disabled`)
- `args`로 props를 명시한다 — 하드코딩된 마크업 반복 금지
- 상호작용이 있으면 기본 동작이 드러나는 스토리를 포함

## Storybook 런타임 도입 시

본 하네스는 **Storybook 런타임 없이 CSF만 산출**한다(의존성 최소화). CSF는 프레임워크 독립적인
파일 형식이라, 나중에 Storybook을 설치하면 이 파일들이 그대로 인식된다. 그때 타입을 붙여 DX를 강화한다:

```tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

export const Primary: StoryObj<typeof meta> = { args: { children: "확인" } };
```
