<template>
  <Popup :index="props.index">
    <Window
      title="字体设置"
      @close="close"
    >
      <div class="font-wrapper">
        <div class="preview">愿此行，终抵群星</div>
        <div class="font">{{ font }}</div>
      </div>
      <template #footer>
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
      </template>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import { popupManager } from '@/assets/scripts/popup'
import { Btn, Popup, Window } from 'star-rail-vue'

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}

const defaultFont = "* { font-family: 'Noto Sans SC'; }"

const getFontName = () => getComputedStyle(document.body).fontFamily.replace(/\"/g, '')
const font = ref(getFontName())

const fontStyle = document.querySelector('style[title=font]')

const setFont = (text: string) => {
  if (fontStyle) {
    fontStyle.innerHTML = text
    font.value = getFontName()
  }
}

const resetFont = () => {
  setFont(defaultFont)
}

const setCustomFont = async () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.onchange = async () => {
    if (el.files?.[0]) {
      popupManager.open('loading')
      setTimeout(() => {
        if (el.files?.[0]) {
          const file = new FileReader()
          file.readAsDataURL(el.files[0])
          file.onload = async (e) => {
            const fontName = 'CustomFont'
            const css = `@font-face{font-family:'${fontName}'; src: url('${
              e.target?.result as string
            }')}* { font-family: '${fontName}'};`
            setFont(css)
            popupManager.close('loading')
          }
        }
      }, 500)
    }
  }
  el.click()
}
</script>

<style lang="stylus" scoped>
.font-wrapper
  margin 40px 0

  .preview
    padding 50px
    border 2px solid rgba(0, 0, 0, 0.2)
    border-radius 10px
    text-align center
    font-size 100px
    user-select none

  .font
    margin-top 20px
    text-align center
    font-weight bold
    font-size 46px
    user-select none

.btn
  width 500px
</style>
