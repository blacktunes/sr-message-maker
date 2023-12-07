import { reactive } from 'vue'
import { input } from './input'

export const popup = reactive({
  setting: false,
  log: false,
  font: false,
  data: false,
  confirm: false,
  input: false,
  avatar: false,
  message: false
})

export const popupCallbalk = reactive<{
  [key in keyof typeof popup]?: () => boolean | undefined
}>({})

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
  openWindow('confirm')
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

export const showInput = (config: {
  title: string
  tip?: string
  required?: boolean
  defaultText?: string
  placeholder?: string
}) => {
  return new Promise<string>((resolve) => {
    inputData.title = config.title
    inputData.tip = config.tip
    inputData.required = config.required === undefined ? true : config.required
    if (config.defaultText) {
      inputData.text = config.defaultText
    }
    inputData.placeholder = config.placeholder
    openWindow('input')
    inputData.fn = (str: string) => {
      resolve(str)
    }
  })
}

export const avatarData = reactive<{
  index: string | number
  name?: string
}>({
  index: 0,
  name: undefined
})

export const messageData = reactive<{
  key?: number
}>({
  key: undefined
})

export const showMessageManager = (key: number) => {
  messageData.key = key
  openWindow('message')
}

export const popupList: (keyof typeof popup)[] = []

export const openWindow = (key: keyof typeof popup) => {
  if (!popup[key]) {
    popupList.push(key)
    popup[key] = true
  }
}

export const closeWindow = (confirm?: boolean) => {
  const key = popupList.pop()
  if (key) {
    if (popup[key]) {
      if (key === 'avatar' && input.select) {
        popupList.push(key)
        return
      }
      if (confirm) {
        if (!popupCallbalk?.[key]?.()) {
          popupList.push(key)
        }
      } else {
        popup[key] = false
      }
      return true
    } else {
      closeWindow(confirm)
    }
  }
}
