import { Button } from "./Button";

// CSF3 스토리 (standards/storybook.md). variant·disabled 상태를 각각 노출.
const meta = {
  title: "Components/Button",
  component: Button,
};

export default meta;

export const Primary = {
  args: { children: "확인", variant: "primary" },
};

export const Secondary = {
  args: { children: "확인", variant: "secondary" },
};

export const Disabled = {
  args: { children: "확인", disabled: true },
};
