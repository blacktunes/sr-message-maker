<template>
  <Window
    :show="popup.font"
    title="字体设置"
    @close="popup.font = false"
  >
    <div class="font">
      <div class="preview">愿此行，终抵群星</div>
      <div class="font">{{ font }}</div>
      <div class="line"></div>
      <Btn
        class="btn"
        name="默认字体"
        @click="resetFont"
      />
      <Btn
        class="btn"
        name="系统字体"
        @click="setFont('')"
      />
      <Btn
        class="btn"
        name="上传字体"
        @click="setCustomFont"
      />
    </div>
  </Window>
</template>

<script lang="ts" setup>
import { popup } from '@/store/popup'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import { ref } from 'vue'

const defaultFont = "* { font-family: 'Noto Sans SC'; }"

const getFontName = () => JSON.parse(getComputedStyle(document.body).fontFamily)
const font = ref(getFontName())

const fontStyle = document.querySelector('style[title=font]')

const setFont = (text: string) => {
  if (fontStyle) {
    fontStyle.innerHTML = text
    font.value = getFontName()
  } else {
    console.warn('字体设置错误')
  }
}

const resetFont = () => {
  setFont(defaultFont)
}

const setCustomFont = async () => {
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
.font
  margin 40px 0

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

  .btn
    margin 10px 0 0 0
    height 100px
    font-size 42px

  .line
    box-sizing border-box
    width 100%
    padding 0 10px
    margin 30px 0 20px 0
    border-bottom 3px solid rgba(150, 150, 150, 0.5)
</style>
