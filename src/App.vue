<template>
  <div class="main">
    <div
      class="home"
      :style="{
        transform: `scale(${scale})`,
        width: `${width}px`,
        height: `${height}px`
      }"
    >
      <transition name="fade">
        <div
          class="loading"
          v-if="setting.loading"
        >
          <Loading />
        </div>
      </transition>
      <div
        class="icon"
        title="更新记录"
        @click.stop="setting.log = true"
      >
        <img
          src="@/assets/images/短信.svg"
          alt=""
        />
        <span>短信</span>
      </div>
      <div class="logo-img">
        <img
          src="@/assets/images/背景.png"
          alt=""
        />
      </div>
      <MessageList />
      <MessageEditor />
      <MessagePreview />
      <CharacterSelect />
      <NameInput />
      <ChangeLog />
      <FontSetting />
      <div class="link">
        <a
          href="https://github.com/blacktunes/sr-message-maker"
          target="_blank"
        >
          Github
        </a>
        <span>·</span>
        <a
          href="https://space.bilibili.com/1384118"
          target="_blank"
        >
          BiliBili
        </a>
        <div
          class="font-btn"
          title="修改字体"
          @click.stop="setting.font = !setting.font"
          v-show="!setting.preview"
        >
          <Icon name="font" />
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div
      class="horizontal-tip"
      v-if="horizontalTip && shouldHorizontal"
      @click.stop="horizontalTip = false"
    >
      <div class="bg"></div>
      <div class="content">
        <div class="img">
          <img src="@/assets/images/horizontal.png" />
        </div>
        <div>建议解除方向锁定后横屏使用</div>
        <div style="font-size: 10px; margin: 5px 0">(点击屏幕关闭提示)</div>
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
import ChangeLog from './components/ChangeLog.vue'
import { setting } from './store/setting'
import Icon from './components/Common/Icon.vue'
import FontSetting from './components/FontSetting.vue'

// 计算窗口尺寸
const width = 3200
const height = (width / 16) * 9
const bottom = 100
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${(height + bottom) * scale.value}px`)

const horizontalTip = ref(true)
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
  width v-bind(realWidth)
  height v-bind(realHeight)

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
      cursor pointer

      span
        margin 0 0 15px 20px
        font-size 46px
        color #ddd

    .logo-img
      z-index -1
      overflow hidden
      position absolute
      top 30px
      left 30px
      width 650px
      height 470px
      opacity 0.4
      pointer-events none
      user-select none

      img
        position absolute
        bottom 0
        right 0
        animation rotate 60s linear infinite

.font-btn
  position absolute
  right 5px
  cursor pointer
  opacity 0.5

  &:hover
    opacity 0.9

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
