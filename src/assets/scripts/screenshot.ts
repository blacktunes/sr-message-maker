import { getFontEmbedCSS, toBlob, toPng } from 'html-to-image'

export const screenshot = async (dom: HTMLElement, width?: number, height?: number) => {
  try {
    const fontEmbedCSS = await getFontEmbedCSS(dom)
    const title = `SR-${Date.now()}`
    if (import.meta.env.MODE === 'development') {
      const dataUrl = await toPng(dom, {
        width,
        height,
        fontEmbedCSS
      })
      const img = new Image()
      img.src = dataUrl
      img.alt = title
      const win = window.open('')
      if (win) {
        win.document.title = title
        win.document.body.appendChild(img)
      }
    } else {
      const blob = await toBlob(dom, {
        width,
        height,
        fontEmbedCSS
      })
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('download', `${title}.png`)
        link.setAttribute('href', url)
        link.click()

        link.remove()
        URL.revokeObjectURL(url)
      }
    }
  } catch (error) {
    console.error('截图保存错误', error)
  }
}
