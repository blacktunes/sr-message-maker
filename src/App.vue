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
const realHeight = computed(() => `${height * scale.value}px`)

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

    .icon
      position absolute
      top 45px
      left 185px
      display flex
      font-size 36px
      align-items center
      user-select none

      span
        margin-left 20px
        line-height 75px
        color #f4f6f5
</style>

<style lang="stylus">
body
  margin 0
</style>
