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
import MessageList from './components/Menu.vue'
import MessageEditor from './components/MessageEditor.vue'
import NameInput from './components/NameInput.vue'
import MessagePreview from './components/MessagePreview.vue'

// 计算窗口尺寸
const width = 3200
const height = 1440
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${(height + 75) * scale.value}px`)

const h = ref(1)
const v = ref(1)
const windowWidth = ref(width)

const setSize = () => {
  windowWidth.value = window.innerWidth
  h.value = window.innerWidth / width
  v.value = window.innerHeight / height
  scale.value = Math.min(h.value, v.value)
}
setSize()

const horizontalTip = ref(true)
const shouldHorizontal = computed(() => windowWidth.value <= 550 && v.value > h.value)

window.onresize = () => {
  setSize()
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
  transition all 0.3s

.fade-enter-from, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave-from
  opacity 1
</style>
