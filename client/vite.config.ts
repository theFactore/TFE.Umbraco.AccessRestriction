import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      fileName: 'index',
      entry: 'src/index.ts', // your web component source file
      formats: ['es'],
    },
    outDir: '../src/wwwroot/App_Plugins/TFE.Umbraco.AccessRestriction', // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        chunkFileNames: `[name]-[hash].js`,
      },
    },
  },
  mode: 'production',
  optimizeDeps: {
    include: ['sinon', '@open-wc/testing'], // Add dependencies used across your tests or main files
  },
});
