import { reactive } from 'vue'

export const popup = reactive<{
  setting: boolean
  log: boolean
  font: boolean
}>({
  setting: true,
  log: false,
  font: false
})
