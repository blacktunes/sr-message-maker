import domtoimage from 'dom-to-image'
import empty from '@/assets/images/empty.png'

export default function (dom: Node, width?: number, height?: number) {
  domtoimage
    .toPng(dom, {
      width,
      height,
      imagePlaceholder: empty
    })
    .then((dataUrl) => {
      if (import.meta.env.MODE === 'development') {
        const img = new Image()
        img.src = dataUrl
        const win = window.open('')
        if (win) win.document.body.appendChild(img)
      } else {
        const link = document.createElement('a')
        link.download = `sr-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      }
    })
    .catch((error) => {
      console.error('截图保存错误', error)
    })
}
