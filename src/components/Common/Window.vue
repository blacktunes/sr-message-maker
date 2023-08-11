<template>
  <div class="window">
    <div
      class="box"
      :style="{
        width,
        height
      }"
      @click.stop
    >
      <div class="title">{{ title }}</div>
      <Close
        class="close"
        @click="close"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Close from './Close.vue'

defineProps<{
  title: string
  width?: string
  height?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

<style lang="stylus" scoped>
@import './Window.styl'

.window
  z-index 99
  display flex
  justify-content center
  align-items center
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  backdrop-filter blur(10px)
  background rgba(0, 0, 0, 0.2)
  box-shadow 0 0 50px 0px rgba(255, 255, 255, 0.5)
  border-radius 20px

  .box
    display flex
    flex-direction column
    position relative
    width 40%
    height 85%
    padding 50px 80px
    background var(--box-background-color)
    message()

    .title
      font-size 70px
      font-weight bold
      padding-bottom 30px
      border-bottom 5px solid rgba(150, 150, 150, 0.5)
      user-select none

    .close
      position absolute
      top 60px
      right 80px
      width 100px
      height 100px
</style>
