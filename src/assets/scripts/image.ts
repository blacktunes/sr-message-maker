export const compressImage = (file: File | Blob, width?: number) => {
  return new Promise<string>((reslove) => {
    if (file.type === 'image/gif') {
      const reader = new FileReader()
      reader.onload = (e) => {
        reslove((e.target?.result as string) || '')
      }
      reader.readAsDataURL(file)
    } else {
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

        width = width ? (img.width < width ? img.width : width) : img.width
        canvas.width = width
        canvas.height = width * (img.height / img.width)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        reslove(canvas.toDataURL('image/webp'))
        URL.revokeObjectURL(src)
      }
    }
  })
}
