import { reactive } from 'vue'

export const popup = reactive({
  setting: false,
  log: false,
  font: false,
  data: false,
  error: false
})

export const errorData = reactive<{
  title: string
  text: string[]
}>({
  title: '',
  text: []
})
