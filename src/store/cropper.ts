import { nextTick, reactive } from 'vue'

export const cropper = reactive<{
  show: boolean
  img: string
  aspectRatio?: number
  maxWidth?: number
  fn?: (img: string) => void
}>({
  show: false,
  img: '',
  aspectRatio: undefined,
  fn: undefined
})

export const cropperOpen = (
  img: string,
  fn: (img: string) => void,
  config?: { aspectRatio?: number; maxWidth?: number }
) => {
  cropper.img = img
  cropper.fn = fn
  cropper.aspectRatio = config?.aspectRatio
  cropper.maxWidth = config?.maxWidth
  cropper.show = true
}

export const cropperClose = async () => {
  cropper.img = ''
  await nextTick()
  cropper.fn = undefined
  cropper.aspectRatio = undefined
  cropper.maxWidth = undefined
  cropper.show = false
}
