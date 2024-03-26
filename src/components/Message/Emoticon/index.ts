export const emoticonData = reactive<{
  show: boolean
  key?: [number, number]
}>({
  show: false
})

export const emoticonOpen = (key?: [number, number]) => {
  emoticonData.key = key
  emoticonData.show = true
}

export const emoticonClose = () => {
  emoticonData.show = false
  emoticonData.key = undefined
}
