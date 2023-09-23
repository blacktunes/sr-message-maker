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
  tip?: string
  text: string[]
  fn?: () => void
}>({
  title: '',
  tip: undefined,
  text: [],
  fn: undefined
})

export const showConfirm = (config: {
  title: string
  tip?: string
  text: string[]
  fn?: () => void
}) => {
  confirmData.title = config.title
  confirmData.tip = config.tip
  confirmData.text = config.text
  confirmData.fn = config.fn
  popup.confirm = true
}
