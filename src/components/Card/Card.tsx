export interface CardProps {
  children?: React.ReactNode;
}

/**
 * Card — standards/component-authoring.md 규칙에 따라 생성된 컴포넌트.
 */
export function Card({ children }: CardProps) {
  return <div className="Card">{children}</div>;
}
