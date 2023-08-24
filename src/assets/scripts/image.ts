export const compressImage = (file: File, width = 500) => {
  return new Promise<string>(reslove => {
    const src = URL.createObjectURL(file)
    const img = new Image()
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reslove('')
        return
      }
  
      width = img.width < width ? img.width : width
      canvas.width = width
      canvas.height = width * (img.height / img.width)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      reslove(canvas.toDataURL(file.type))
      URL.revokeObjectURL(src)
    }
  })
}
