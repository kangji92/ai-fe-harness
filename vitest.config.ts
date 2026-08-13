import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    // 템플릿(__NAME__)과 참고용 예시(Playwright 미설치)는 테스트 대상에서 제외
    exclude: [...configDefaults.exclude, "templates/**", "examples/**"],
  },
});
