import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  // tsconfigPaths: tsconfig의 paths를 단일 진실원천으로 읽어 alias를 구성한다(references 따라 app.json 자동 발견).
  // vite에 alias를 따로 두지 않으므로 tsconfig와 어긋날 여지가 없다. Vitest도 이 플러그인을 그대로 사용.
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // 프론트엔드(src)만 담당한다. supabase 엣지 함수는 Deno 런타임 테스트(deno test)로 별도 검증.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
