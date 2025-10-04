import { createLog } from './create-log'
import { fetchAvt } from './fetch-avatar'
import { fetchChar } from './fetch-character'

;(async () => {
  await createLog(await fetchAvt(), await fetchChar())
})()
