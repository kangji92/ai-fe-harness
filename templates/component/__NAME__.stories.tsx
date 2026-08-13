import { __NAME__ } from "./__NAME__";

// CSF3 스토리 (standards/storybook.md).
// Storybook 런타임 도입 시 @storybook/react의 Meta/StoryObj 타입을 붙인다.
const meta = {
  title: "Components/__NAME__",
  component: __NAME__,
};

export default meta;

export const Default = {
  args: {
    children: "__NAME__",
  },
};
