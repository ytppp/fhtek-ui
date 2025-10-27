import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      include: ['packages/**/*.ts', 'packages/**/*.vue'],
      outDir: 'dist/types',
      exclude: ['packages/**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/index.ts'),
      name: 'FhtekUi',
      fileName: (format) => `index.${format}.js`,
      // formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
