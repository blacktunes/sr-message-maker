import { reactive } from 'vue'

export const popup = reactive({
  setting: false,
  log: false,
  font: false,
  data: false,
  confirm: false
})

export const confirmData = reactive<{
  title: string
  text: string[],
  fn?: () => void
}>({
  title: '',
  text: [],
  fn: undefined,
})
