import { test, expect } from "@playwright/test";

// 참고용 예시 — standards/e2e.md 규칙을 따른다.
// 실행하려면 @playwright/test 설치 + 브라우저가 필요하다 (본 하네스는 런타임 미설치).
test("사용자가 로그인해 대시보드에 도달한다", async ({ page }) => {
  // Arrange
  await page.goto("/login");

  // Act — role·label 기반 셀렉터, 자동 대기
  await page.getByLabel("이메일").fill("user@example.com");
  await page.getByLabel("비밀번호").fill("secret");
  await page.getByRole("button", { name: "로그인" }).click();

  // Assert — 관찰 가능한 결과
  await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible();
});
