export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * Button — 하네스로 스캐폴딩한 뒤 요구사항에 맞게 확장한 예시 컴포넌트.
 * standards/component-authoring.md 규칙(명시적 props 타입, 접근성 role)을 따른다.
 */
export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
