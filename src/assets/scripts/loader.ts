import { imageCompress } from 'star-rail-vue'

export const urlToBase64 = (url: string, base64?: boolean) => {
  return new Promise<string>((resolve) => {
    fetch(url).then((res) =>
      res.blob().then((blob) => {
        if (base64) {
          imageCompress(blob).then((img) => {
            resolve(img)
          })
        } else {
          resolve(URL.createObjectURL(blob))
        }
      })
    )
  })
}
