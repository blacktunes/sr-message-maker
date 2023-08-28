<template>
  <transition name="fade">
    <div
      class="horizontal-tip"
      v-if="isShow && show"
      @click.stop="isShow = false"
    >
      <div class="bg"></div>
      <div class="content">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
        >
          <path
            d="M832 448l-128-128h96V224a32 32 0 0 0-32-32h-192V128h192a96 96 0 0 1 96 96v96h96zM448 160a32 32 0 0 0-32-32H160a32 32 0 0 0-32 32v288H64V160a96 96 0 0 1 96-96h256a96 96 0 0 1 96 96v288h-64V160zM160 512h704a96 96 0 0 1 96 96v256a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96v-256a96 96 0 0 1 96-96zM128 864a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32v-256a32 32 0 0 0-32-32H160a32 32 0 0 0-32 32v256z"
            fill="#666666"
          ></path>
        </svg>
        <div style="font-size: 30px; margin-top: 10px; text-align: center">
          建议解除方向锁定后横屏使用
        </div>
        <div style="font-size: 10px; margin: 5px 0">(点击屏幕关闭提示)</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  show: boolean
}>()

const isShow = ref(true)
</script>

<style lang="stylus" scoped>
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
</style>
