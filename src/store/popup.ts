import { reactive } from 'vue'

export const popup = reactive<{
  setting: boolean
  log: boolean
  font: boolean
}>({
  setting: false,
  log: false,
  font: false
})
