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
      <div class="item">
        <slot></slot>
      </div>
      <div class="footer" v-if="slot.footer">
        <slot name="footer"></slot>
      </div>
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

const slot = defineSlots()

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
    width fit-content
    max-width 90%
    height fit-content
    max-height 85%
    background var(--box-background-color)
    message()

    .title
      font-size 70px
      font-weight bold
      border-bottom 5px solid rgba(150, 150, 150, 0.5)
      margin 0 80px
      padding 50px 0 30px 0
      user-select none

    .close
      position absolute
      top 60px
      right 80px
    
    .item
      margin 40px 80px
      overflow auto
    
    .footer
      background #262626
      padding 60px 80px
</style>
