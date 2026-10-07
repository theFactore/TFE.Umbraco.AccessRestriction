import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    lib: {
      fileName: 'index',
      entry: 'src/index.ts', // your web component source file
      formats: ['es'],
    },
    outDir: '../src/wwwroot/App_Plugins/TFE.Umbraco.AccessRestriction', // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rolldownOptions: {
      external: [/^@umbraco/],
      output: {
        codeSplitting: false,
        chunkFileNames: `[name]-[hash].js`,
      },
    },
  },
  mode: 'production',
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
    },
  },
});
