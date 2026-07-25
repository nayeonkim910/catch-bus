import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // 프론트엔드(src)만 담당한다. supabase 엣지 함수는 Deno 런타임 테스트(deno test)로 별도 검증.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
