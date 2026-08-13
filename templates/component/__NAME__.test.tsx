import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { __NAME__ } from "./__NAME__";

describe("__NAME__", () => {
  it("자식 요소를 렌더링한다", () => {
    render(<__NAME__>content</__NAME__>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
