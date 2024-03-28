<template>
  <div class="link">
    <Transition name="fade-out">
      <div
        v-show="progress[0] > 0 && progress[1] < progress[0]"
        class="progress"
      >
        <span>图片预加载[</span>{{ progress[1] }}/{{ progress[0] }}]
      </div>
    </Transition>
    <a
      href="https://github.com/blacktunes/sr-message-maker"
      target="_blank"
    >
      Github
    </a>
    <div class="sep"></div>
    <a
      href="https://space.bilibili.com/1384118"
      target="_blank"
    >
      BiliBili
    </a>
  </div>
</template>

<script lang="ts" setup>
import { progress } from '@/assets/scripts/preload'
</script>

<style lang="stylus" scoped>
.link
  position absolute
  bottom -80px
  display flex
  justify-content center
  align-items center
  width 100%
  height 75px
  color #ddd

  .progress
    position absolute
    bottom 0
    left 180px
    display flex
    justify-content center
    align-items center
    box-sizing border-box
    height 75px
    color rgba(255, 255, 255, 0.3)
    font-size 38px
    user-select none

  .sep
    margin 0 25px
    width 10px
    height 10px
    border-radius 50%
    background-color #666

  a
    color #ddd
    text-decoration none
    font-size 50px
    opacity 0.25
    user-select none

    &:hover
      opacity 9
</style>
