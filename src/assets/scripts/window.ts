import { viewport } from '@/store/viewport'

let isInputFocus = false
const setSize = () => {
  document.documentElement.style.setProperty('--window-w', `${window.innerWidth}px`)
  document.documentElement.style.setProperty('--window-h', `${window.innerHeight}px`)

  viewport.horizontal = window.innerWidth <= 550 && window.innerWidth < window.innerHeight
  viewport.scale = Math.min(
    window.innerWidth / viewport.width,
    window.innerHeight / (viewport.height + viewport.bottom)
  )
}

setSize()

document.addEventListener(
  'focus',
  function (event) {
    const targetElement = event.target as HTMLElement
    if (targetElement.tagName.toLowerCase() === 'input') {
      isInputFocus = true
    }
  },
  true
)

document.addEventListener(
  'blur',
  function (event) {
    const targetElement = event.target as HTMLElement
    if (targetElement.tagName.toLowerCase() === 'input') {
      isInputFocus = false
    }
  },
  true
)

window.onresize = () => {
  if (!isInputFocus) {
    setSize()
  }
}

const match = window.matchMedia('(orientation:portrait)')
match.addEventListener('change', () => {
  setSize()
})
