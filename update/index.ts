import { fetchAvt } from './fetch-avatar'
import { fetchChar } from './fetch-character'

;(async () => {
  await fetchAvt()
  await fetchChar()
})()
