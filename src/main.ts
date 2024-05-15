import './main.styl'

import App from './App.vue'
import { analytics } from 'star-rail-vue'
import { hotkey } from './assets/scripts/hotkey'
import { logCheck } from './assets/scripts/log'
import { loadDatabase } from './assets/scripts/database'

window.BUILD_TIME = new Date(BUILD_TIME)

analytics('G-PW30Q3ZHX1', import.meta.env.MODE === 'development')

createApp(App).mount('#app')

hotkey()
logCheck('sr-message-time')
loadDatabase()
