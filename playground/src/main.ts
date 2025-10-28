import { createApp } from 'vue'
import App from './App.vue'
// import FhtekUI from 'fhtek-ui'
import { registerI18n } from '@fhtek-ui/components'

const app = createApp(App)
// app.use(FhtekUI)
registerI18n(app)
app.mount('#app')
