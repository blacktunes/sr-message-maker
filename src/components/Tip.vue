<template>
  <transition name="fade">
    <div
      class="horizontal-tip"
      v-if="isShow && show"
      @click.stop="isShow = false"
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

    .img
      width 25%

      img
        width 100%
</style>
