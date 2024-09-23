import './main.styl'

import { analytics } from 'star-rail-vue'
import App from './App.vue'
import { loadDatabase } from './assets/scripts/database'
import { hotkey } from './assets/scripts/hotkey'
import { logCheck } from './assets/scripts/log'
import { updateCheck } from './assets/scripts/update'

if (import.meta.env.MODE === 'production') {
  analytics('G-PW30Q3ZHX1')
}

createApp(App).mount('#app')

hotkey()
logCheck('sr-message-update')
loadDatabase().then(updateCheck)
