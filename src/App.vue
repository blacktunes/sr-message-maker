<template>
  <div class="main">
    <div
      class="wrapper"
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
      <MessageContent />
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
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import CharacterSelect from './components/CharacterSelect.vue'
import MessageContent from './components/MessageContent.vue'
import MessageList from './components/MessageList.vue'
import NameInput from './components/NameInput.vue'

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

window.onresize = () => {
  setSize()
}

const ready = ref(false)
onMounted(() => {
  ready.value = true
})

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

  .wrapper
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
      background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg')
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
</style>

<style lang="stylus">
body
  margin 0

.del
  transition opacity 0.2s

&::-webkit-scrollbar
  width 10px
  height 10px

&::-webkit-scrollbar-track
  background #c6c6c6

&::-webkit-scrollbar-thumb
  background #545454
</style>
