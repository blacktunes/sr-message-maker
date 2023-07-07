<template>
  <div>
    <slot name="top"></slot>
    <div class="box" ref="boxDom">
      <div class="circle">
        <div></div>
      </div>
      <div class="header">
        <div v-if="preview" class="title">
          {{ title }}
        </div>
        <input
          v-else
          class="title"
          @keydown.enter.prevent
          :value="title"
          @input="updateTitle"
        />
        <div class="info">{{ info }}</div>
      </div>
      <div class="message-list" ref="listDom">
        <slot></slot>
      </div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  title: string
  info?: string
  preview?: boolean
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'title', data: string): void
}>()

const boxDom = ref<HTMLElement | null>(null)
const listDom = ref<HTMLElement | null>(null)

const updateTitle = (e: Event) => {
  emit('title', (e.target as HTMLInputElement).value)
}

defineExpose({ boxDom, listDom })
</script>

<style lang="stylus" scoped>
.box
  display flex
  flex-direction column
  width 100%
  height 100%
  background #d8d8d8
  box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
  border-radius 0 50px 0 0

  &:before
    content ''
    position absolute
    box-sizing border-box
    left 15px
    top 0
    width 0
    height 350px
    border-left 5px solid rgba(180, 180, 180, 0.5)
    pointer-events none

  &:after
    content ''
    position absolute
    box-sizing border-box
    left -15px
    top 15px
    width 350px
    height 0
    border-top 5px solid rgba(180, 180, 180, 0.5)
    pointer-events none

  .circle
    overflow hidden
    position absolute
    box-sizing border-box
    width 150px
    height 150px
    pointer-events none

    div
      z-index 1
      border 5px solid rgba(180, 180, 180, 0.5)
      position absolute
      top -45px
      left -40px
      width 120%
      height 120%
      border-radius 50%

  .header
    z-index 2
    display flex
    flex-direction column
    justify-content center
    box-sizing border-box
    position relative
    width 100%
    height 185px
    padding 0 70px
    border-bottom 5px solid rgba(150, 150, 150, 0.5)
    box-shadow 0px 40px 20px -20px rgba(210, 210, 210, 0.5)

    .title
      color #121212
      font-size 50px
      font-weight bold
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      background transparent
      border none

    .info
      color #6a6a6a
      font-size 40px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

  .message-list
    overflow-y auto
    overflow-y overlay
    overflow-x hidden
    scrollbar-gutter stable
    flex 1
    display flex
    flex-direction column
    margin 0 70px 0 50px
    padding 30px 70px 30px 50px

    &::-webkit-scrollbar-track
      position absolute
      top 10px
      margin 30px 0
</style>
