import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // dts({
    //   include: ['packages/**/*.ts', 'packages/**/*.vue'],
    //   outDir: 'dist/types',
    //   exclude: ['packages/**/*.spec.ts'],
    // }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, './assets/style/variables.less')}";`,
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'fhtek-ui',
      fileName: (format) => `index.${format}.js`,
    },
    outDir: path.resolve(__dirname, '../../dist'),
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        entryFileNames: '[name].[hash:8].[format].js',
        chunkFileNames: '[name].[hash:8].[format].js',
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.length && assetInfo.names[0].endsWith('.css')) {
            return 'css/style.[hash:8].css' // 'css/[name].[hash:8].css'
          }
          return 'assets/[name].[hash:8].[ext]'
        },
      },
    },
  },
})
