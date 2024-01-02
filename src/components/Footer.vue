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
    box-sizing border-box
    display flex
    justify-content center
    align-items center
    position absolute
    left 180px
    bottom 0
    height 75px
    font-size 38px
    color rgba(255, 255, 255, 0.3)
    user-select none

  .sep
    width 10px
    height 10px
    background-color #666
    border-radius 50%
    margin 0 25px

  a
    color #ddd
    font-size 50px
    user-select none
    text-decoration none
    opacity 0.25

    &:hover
      opacity 9
</style>
