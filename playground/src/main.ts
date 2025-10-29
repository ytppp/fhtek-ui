import { createApp } from 'vue'
import App from './App.vue'
import { default as FhtekUI, registerI18n } from '@fhtek-ui/components'
import registerRouter from './router'

const app = createApp(App)
app.use(FhtekUI)
registerI18n(app)
registerRouter(app)
app.mount('#app')
