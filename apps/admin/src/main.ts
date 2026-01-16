import { createApp } from 'vue'
import FhtekUI from '@fhtek-ui/components'
import setupPlugins from './plugins'
import App from './App.vue'
import '@/assets/style/main.less'
import(`@/assets/style/customer-conf/${__APP_CUSTOMER_CONFIG__.name}/custom.less`)

// 注册原型链上的扩展方法
import './extensions'

const app = createApp(App)

app.use(FhtekUI)
app.use(setupPlugins)

app.mount('#app')
