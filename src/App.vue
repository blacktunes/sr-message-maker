<template>
  <div
    id="main"
    :style="{
      width: `${width * scale}px`,
      height: `${(height + bottom) * scale}px`
    }"
  >
    <div
      id="home"
      :style="{
        transform: `scale(${scale})`,
        width: `${width}px`,
        height: `${height}px`
      }"
    >
      <Component
        v-for="(item, index) in components"
        :key="index"
        :is="item"
      />
      <Component
        v-for="(item, key) in popupComponents"
        :index="item.index"
        :name="key"
        :is="item.compontnt"
        :key="key"
        @close="closeWindow"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import viewport from './store/viewport'
import { closeWindow, popupComponents } from './assets/scripts/popup'

// 动态加载所有组件
const components: Component[] = []
const modules = {
  ...import.meta.glob<{ default: Component }>(
    [
      // 组件位置
      './components/*.vue'
    ],
    {
      eager: true,
      import: 'default'
    }
  )
}
for (const i in modules) {
  components.push(defineComponent<{}>(modules[i]))
}

// 计算窗口尺寸
const width = 3200
const height = (width / 16) * 9
const bottom = 100
const scale = toRef(viewport, 'scale')

let isInputFocus = false
const setSize = () => {
  document.documentElement.style.setProperty('--window-w', `${window.innerWidth}px`)
  document.documentElement.style.setProperty('--window-h', `${window.innerHeight}px`)

  viewport.horizontal = window.innerWidth <= 550 && window.innerWidth < window.innerHeight
  viewport.scale = Math.min(window.innerWidth / width, window.innerHeight / (height + bottom))
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
</script>

<style lang="stylus" scoped>
#main
  #home
    position relative
    width 100%
    height 100%
    transform-origin left top

    &:before
      position absolute
      top 0px
      right 0px
      bottom 0px
      left 0px
      z-index -1
      background url('@/assets/images/方块背景.webp')
      content ''
      opacity 0.15

    &:after
      position absolute
      z-index -2
      width 100%
      height 100%
      background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg'), rgba(0, 0, 0, 0.6)
      filter blur(30px)
      background-position center
      background-size cover
      content ''
      opacity 0.8
</style>
