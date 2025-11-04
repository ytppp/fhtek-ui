import { createApp } from 'vue'
import App from './App.vue'
import { default as FhtekUI } from '@fhtek-ui/components'
import registerRouter from './router'

const app = createApp(App)
app.use(FhtekUI)
registerRouter(app)
app.mount('#app')
