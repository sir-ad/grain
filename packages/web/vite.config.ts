import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GrainWeb',
      formats: ['es', 'umd'],
      fileName: 'grain-web'
    },
    rollupOptions: {
      external: ['grain'],
      output: {
        globals: {
          grain: 'Grain'
        },
        assetFileNames: 'grain-web.[ext]'
      }
    },
    cssCodeSplit: false,
    cssInjectedByJs: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'grain': resolve(__dirname, '../core/src')
    }
  }
});
