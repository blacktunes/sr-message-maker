import { reactive } from 'vue'

export const popup = reactive({
  setting: false,
  log: false,
  font: false,
  data: false,
  confirm: false,
  input: false,
  avatar: false
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

export const inputData = reactive<{
  title: string
  tip?: string
  required: boolean
  text: string
  placeholder?: string
  fn?: (str: string) => void
}>({
  title: '',
  tip: undefined,
  required: true,
  text: '',
  placeholder: undefined,
  fn: undefined
})

export const showInput = (
  title: string,
  tip?: string,
  required = true,
  defaultText?: string,
  placeholder?: string
) => {
  return new Promise<string>((resolve) => {
    inputData.title = title
    inputData.tip = tip
    inputData.required = required
    if (defaultText) {
      inputData.text = defaultText
    }
    inputData.placeholder = placeholder
    popup.input = true
    inputData.fn = (str: string) => {
      resolve(str)
    }
  })
}
