import { vitePlugin, removeViteLogging } from '@remcovaes/web-test-runner-vite-plugin';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' }), playwrightLauncher({ product: 'webkit' })],
  files: 'src/**/*.test.ts',
  filterBrowserLogs: removeViteLogging,
  plugins: [vitePlugin()],
};
