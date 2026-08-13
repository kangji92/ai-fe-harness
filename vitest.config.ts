import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    // 템플릿(__NAME__ 플레이스홀더)은 테스트 대상에서 제외
    exclude: [...configDefaults.exclude, "templates/**"],
  },
});
