<template>
  <div
    class="main"
    :style="{
      width: `${width * scale}px`,
      height: `${(height + bottom) * scale}px`
    }"
  >
    <div
      class="home"
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
    </div>
  </div>
  <Tip :show="shouldHorizontal" />
  <ImageCropper :scale="scale" />
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import type { Component } from 'vue'
import Tip from './components/Tip.vue'
import ImageCropper from './components/ImageCropper.vue'

// 动态加载所有组件
const components: Component[] = []
const modules = {
  ...import.meta.glob<{ default: Component }>(
    [
      // 组件位置
      './components/*.vue',
      '!./components/Tip.vue',
      '!./components/ImageCropper.vue',
      './components/Popup/*.vue'
    ],
    {
      eager: true,
      import: 'default'
    }
  )
}
for (const i in modules) {
  components.push(defineComponent(modules[i]))
}

// 计算窗口尺寸
const width = 3200
const height = (width / 16) * 9
const bottom = 100
const scale = ref(1)

const shouldHorizontal = ref(false)

const setSize = () => {
  shouldHorizontal.value = window.innerWidth <= 550 && window.innerWidth < window.innerHeight
  scale.value = Math.min(window.innerWidth / width, window.innerHeight / (height + bottom))
}
setSize()

window.onresize = () => {
  setSize()
}
</script>

<style lang="stylus" scoped>
.main
  .home
    position relative
    height 100%
    width 100%
    transform-origin left top

    &:before
      content ''
      z-index -1
      position absolute
      top 0px
      right 0px
      bottom 0px
      left 0px
      background url('@/assets/images/方块背景.webp')
      opacity 0.15

    &:after
      content ''
      z-index -2
      position absolute
      width 100%
      height 100%
      background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg'), rgba(0,0,0,0.6)
      background-size cover
      background-position center
      filter blur(30px)
</style>
