import { getFontEmbedCSS, toPng } from 'html-to-image'

export const screenshot = async (dom: HTMLElement, width?: number, height?: number) => {
  try {
    const fontEmbedCSS = await getFontEmbedCSS(dom)
    const title = `SR-${Date.now()}`
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
  } catch (error) {
    console.error('截图保存错误', error)
  }
}
