<template>
  <transition name="fade">
    <Window
      v-if="setting.font"
      title="字体设置"
      width="50%"
      @close="setting.font = false"
    >
      <div class="preview">愿此行，终抵群星</div>
      <div class="font">{{ font }}</div>
      <template #footer>
        <div class="btn-list">
          <Btn
            name="默认字体"
            @click="resetFont"
          />
          <Btn
            name="系统字体"
            @click="setFont('')"
          />
          <Btn
            name="上传字体"
            @click="setCustomFont"
          />
        </div>
      </template>
    </Window>
  </transition>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'
import Window from './Common/Window.vue'
import Btn from './Common/Btn.vue'
import { ref } from 'vue'

const defaultFont = "* { font-family: 'Noto Sans SC'; }"

const font = ref(getComputedStyle(document.body).fontFamily)

const fontStyle = document.querySelector('style[title=font]')

const setFont = (text: string) => {
  if (fontStyle) {
    fontStyle.innerHTML = text
    font.value = getComputedStyle(document.body).fontFamily
  } else {
    console.warn('字体设置错误')
  }
}

const resetFont = () => {
  setFont(defaultFont)
}

const setCustomFont = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = (e) => {
        const fontName = 'CustomFont'
        const css = `@font-face{font-family:'${fontName}'; src: url('${
          e.target?.result as string
        }')}* { font-family: '${fontName}'};`
        setFont(css)
      }
    }
  }
  el.click()
}
</script>

<style lang="stylus" scoped>
.preview
  font-size 100px
  text-align center
  padding 50px
  border 2px solid rgba(0, 0, 0, 0.2)
  border-radius 10px
  user-select none

.font
  font-size 40px
  text-align center
  margin-top 20px
  user-select none

.btn-list
  display flex
  align-content center
  justify-content space-between
</style>
