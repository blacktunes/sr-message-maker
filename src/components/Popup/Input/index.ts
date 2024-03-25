export const inputData = reactive<{
  title: string
  tip?: string
  required: boolean
  text: string
  placeholder?: string
  fn?: (str: string | null) => void
}>({
  title: '',
  tip: undefined,
  required: true,
  text: '',
  placeholder: undefined,
  fn: undefined
})

export const inputOpen = (config: {
  title: string
  tip?: string
  required?: boolean
  defaultText?: string
  placeholder?: string
}) => {
  return new Promise<string | null>((resolve) => {
    inputData.title = config.title
    inputData.tip = config.tip
    inputData.required = config.required === undefined ? true : config.required
    if (config.defaultText) {
      inputData.text = config.defaultText
    }
    inputData.placeholder = config.placeholder
    inputData.fn = (str) => {
      resolve(str)
    }
  })
}

export const inputClose = () => {
  inputData.fn?.(null)
  inputData.title = ''
  inputData.tip = undefined
  inputData.required = true
  inputData.text = ''
  inputData.placeholder = undefined
  inputData.fn = undefined
}
