import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

let CUSTOMER_ID = 'demo'
let WIFI_VERSION = 'v7'
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = process.env.CUSTOMER_ID
}
if (process.env.WIFI_VERSION) {
  WIFI_VERSION = process.env.WIFI_VERSION
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const module = await import(`./src/customer-conf/${CUSTOMER_ID}.json`)
  console.log(`CUSTOMER_ID: ${CUSTOMER_ID}, WIFI_VERSION: ${WIFI_VERSION}`)
  console.log(`CUSTOMER_CONFIG: ${JSON.stringify(module.default)}`)
  const customerConf = {
    ...module.default,
    wifiVersion: WIFI_VERSION,
  }
  return {
    plugins: [vue(), vueJsx, vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __APP_CUSTOMER_CONFIG__: JSON.stringify(customerConf),
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, `src/assets/style/customer-conf/${CUSTOMER_ID}/variables.less`)}";`,
        },
      },
    },
    server: {
      proxy: {
        '/sys_log.log': {
          target: 'http://192.168.100.1',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/action': {
          target: 'http://192.168.100.1',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/action/, '/action'),
          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              let setcookies = proxyRes.headers['set-cookie']
              if (setcookies) {
                setcookies = setcookies[0].replace(/domain=[^;]+;\s+/, '') // remove 'domain=*; ', * means all domain
                proxyRes.headers['set-cookie'] = [setcookies]
              }
            })
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: '[ext]/[name].[ext]',
        },
      },
    },
  }
})
