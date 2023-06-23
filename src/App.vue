<template>
  <div class="main">
    <div
      class="home"
      :style="{
        transform: `scale(${scale})`,
        width: `${width}px`,
        height: `${height}px`,
      }"
    >
      <transition name="fade">
        <div class="loading" v-if="messageLoading">
          <Loading />
        </div>
      </transition>
      <div class="icon">
        <img src="@/assets/images/icon.png" alt="" :draggable="false" />
        <span>短信</span>
      </div>
      <MessageList />
      <MessageEditor />
      <MessagePreview />
      <CharacterSelect />
      <NameInput />
      <div class="link">
        <a href="https://github.com/blacktunes/sr-message-maker" target="_blank"
          >Github</a
        >
        <span>·</span>
        <a href="https://space.bilibili.com/1384118" target="_blank"
          >BiliBili</a
        >
        <a class="font-btn" @click="setFont">修改字体[测试功能]</a>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div
      class="horizontal-tip"
      v-if="horizontalTip && shouldHorizontal"
      @click="horizontalTip = false"
    >
      <div class="bg"></div>
      <div class="content">
        <div class="img">
          <img src="@/assets/images/horizontal.png" />
        </div>
        <div>推荐横屏使用</div>
        <div style="font-size: 10px">(点击屏幕关闭提示)</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CharacterSelect from './components/CharacterSelect.vue'
import Loading from './components/Loading.vue'
import MessageList from './components/Menu.vue'
import MessageEditor from './components/MessageEditor.vue'
import MessagePreview from './components/MessagePreview.vue'
import NameInput from './components/NameInput.vue'
import { messageLoading } from './store/message'

// 计算窗口尺寸
const width = 3200
const height = 1440
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${(height + 75) * scale.value}px`)

const windowWidth = ref(width)
const windowHeight = ref(height)

const setSize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  scale.value = Math.min(
    window.innerWidth / width,
    window.innerHeight / (height + 75)
  )
}
setSize()

const horizontalTip = ref(true)
const shouldHorizontal = computed(() => windowWidth.value <= 550 && windowWidth.value < windowHeight.value)

window.onresize = () => {
  setSize()
}

const setFont = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = e => {
        const css = `@font-face{font-family:'TempFont'; src: url(${(e.target?.result as string).replace('data:application/octet-stream;', 'data:application/font-ttf;')})}`
        const head = document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(css))
        head.appendChild(style)

        document.body.style.fontFamily = 'TempFont'
      }
    }
  }
  el.click()
}
</script>

<style lang="stylus" scoped>
.main
  overflow hidden
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  margin auto
  width v-bind(realWidth)
  height v-bind(realHeight)

  .home
    position relative
    height 100%
    width 100%
    transform-origin left top

    &:after
      content ''
      z-index -1
      position absolute
      width 100%
      height 100%
      background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg'), radial-gradient(black, #555) // patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg), radial-gradient(black, #555)
      background-size 100%
      filter blur(30px)

    .loading
      z-index 999
      display flex
      justify-content center
      align-items center
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      background rgba(0, 0, 0, 0.6)

    .link
      position absolute
      bottom -80px
      display flex
      width 100%
      justify-content center

      a, span
        color #666
        font-size 50px
        user-select none

      a
        text-decoration none

      span
        margin 0 20px

    .icon
      position absolute
      top 45px
      left 185px
      display flex
      align-items center
      user-select none

      span
        margin 0 0 15px 20px
        font-size 46px
        color #ddd

.font-btn
  position absolute
  right 100px
  cursor pointer

.horizontal-tip
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  display flex
  justify-content center
  align-items center

  .bg
    z-index 5
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background rgba(255, 255, 255, 0.8)

  .content
    z-index 999
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 100%
    color #8a8a8a
    user-select none

    .img
      width 25%

      img
        width 100%
</style>

<style lang="stylus">
html
  scrollbar-width none

  &::-webkit-scrollbar
    width 0
    height 0

body
  margin 0
  font-family Microsoft Yahei

.del
  transition opacity 0.2s

::-webkit-scrollbar
  width 10px
  height 10px

::-webkit-scrollbar-track
  background #c6c6c6

::-webkit-scrollbar-thumb
  background #545454

.fade-enter-active, .fade-leave-active
  transition all 0.2s

.fade-enter-from, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave-from
  opacity 1
</style>
