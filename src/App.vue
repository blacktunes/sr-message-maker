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
      <Loading />
      <Header />
      <NameInput />
      <Menu />
      <MessageEditor />
      <MessagePreview />
      <CharacterSelect />
      <Footer />
      <ChangeLog />
      <FontSetting />
    </div>
  </div>
  <Tip :show="shouldHorizontal" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Loading from './components/Loading.vue'
import Header from './components/Header.vue'
import NameInput from './components/NameInput.vue'
import Menu from './components/Menu.vue'
import MessageEditor from './components/MessageEditor.vue'
import MessagePreview from './components/MessagePreview.vue'
import CharacterSelect from './components/CharacterSelect.vue'
import Footer from './components/Footer.vue'
import ChangeLog from './components/Popup/ChangeLog.vue'
import FontSetting from './components/Popup/FontSetting.vue'
import Tip from './components/Tip.vue'

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
      background url('@/assets/images/方块背景.png')
      opacity 0.15
      box-shadow inset 0 0 50px 0px #ffffff

    &:after
      content ''
      z-index -2
      position absolute
      width 100%
      height 100%
      background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg'), radial-gradient(black, #555)
      background-size 100%
      filter blur(30px)
</style>
