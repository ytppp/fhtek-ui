import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'packages'),
  //   },
  // },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      include: ['packages/**/*.ts', 'packages/**/*.vue'],
      outDir: 'dist/types',
      exclude: ['packages/**/*.spec.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'packages'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './packages/components/index.ts'),
      name: 'FhtekUi',
      fileName: (format) => `index.${format}.js`,
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
