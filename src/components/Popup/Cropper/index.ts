import { imageCompress } from '@/assets/scripts/images'
import { SuperImageCropper } from 'super-image-cropper'
import { reactive } from 'vue'

export const imageCropper = new SuperImageCropper()

export const cropperSetting = reactive<{
  img: string
  aspectRatio?: number
  fn?: (img: string) => void
}>({
  img: ''
})

export const cropperOpen = (config?: { aspectRatio?: number; maxWidth?: number }) => {
  return new Promise<{ base64: string; raw: File }>((resolve) => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = 'image/*'
    el.onchange = async () => {
      if (el.files?.[0]) {
        resolve({
          base64: await _cropperOpen(
            await imageCompress(el.files[0], config?.maxWidth),
            config?.aspectRatio
          ),
          raw: el.files[0]
        })
      }
    }
    el.click()
  })
}

const _cropperOpen = (img: string, aspectRatio?: number) => {
  return new Promise<string>((resolve) => {
    cropperSetting.img = img
    cropperSetting.aspectRatio = aspectRatio
    cropperSetting.fn = (str) => resolve(str)
  })
}

export const cropperClose = () => {
  cropperSetting.img = ''
  cropperSetting.aspectRatio = undefined
  cropperSetting.fn = undefined
}
