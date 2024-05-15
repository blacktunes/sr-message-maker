<template>
  <div>
    <slot name="top"></slot>
    <div
      class="box"
      :class="{ box_preview: preview }"
      ref="boxDom"
    >
      <transition
        name="header-fade"
        appear
      >
        <div
          v-if="!preview"
          class="circle"
          :key="index"
        >
          <div></div>
        </div>
      </transition>
      <div class="header">
        <transition
          :name="preview ? '' : 'slide-left'"
          appear
        >
          <div :key="index">
            <div
              v-if="preview"
              class="title"
            >
              {{ title }}
            </div>
            <input
              v-else
              class="title"
              :value="title"
              @keydown.prevent.stop="blur"
              @focus="getTitle"
              @blur="updateTitle"
            />
            <div class="info">{{ info }}</div>
          </div>
        </transition>
      </div>
      <div
        class="message-list"
        ref="listDom"
        @scroll="handleScroll($event.target as HTMLElement)"
      >
        <slot></slot>
      </div>
      <div class="middle">
        <transition name="arrow-fade">
          <div
            class="arrow"
            v-show="!playing && scrollTip"
          >
            <icon name="bottom" />
          </div>
        </transition>
      </div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '../Common/Icon.vue'
import { blur } from './Message'

defineProps<{
  index: number
  title: string
  info?: string
  preview?: boolean
  playing?: boolean
}>()

const emit = defineEmits<{
  (event: 'title', data: string): void
}>()

const boxDom = ref<HTMLElement | null>(null)
const listDom = ref<HTMLElement | null>(null)

const scrollTip = ref(false)

const handleScroll = (el: HTMLElement) => {
  scrollTip.value = el.scrollHeight - (el.scrollTop + el.clientHeight) > 250
}

const updateArrow = () => {
  if (listDom.value) {
    handleScroll(listDom.value)
  }
}

let oldTitle = ''
const getTitle = (e: Event) => {
  oldTitle = (e.target as HTMLInputElement).value
}

const updateTitle = (e: Event) => {
  const newTitle = (e.target as HTMLInputElement).value
  if (newTitle === oldTitle) return

  emit('title', (e.target as HTMLInputElement).value)
}

defineExpose({ boxDom, listDom, updateArrow })
</script>

<style lang="stylus" scoped>
.box_preview
  &:before
    content none !important

  &:after
    z-index -1

.box
  display flex
  flex-direction column
  width 100%
  height 100%
  border-radius 0 50px 0 0
  background var(--box-background-color)
  box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)

  &:before
    position absolute
    top 0
    left 15px
    box-sizing border-box
    width 0
    height 350px
    border-left 5px solid rgba(180, 180, 180, 0.5)
    content ''
    pointer-events none

  &:after
    position absolute
    top 15px
    left -15px
    box-sizing border-box
    width 350px
    height 0
    border-top 5px solid rgba(180, 180, 180, 0.5)
    content ''
    pointer-events none

  .circle
    position absolute
    overflow hidden
    box-sizing border-box
    width 150px
    height 150px
    pointer-events none

    div
      position absolute
      top -45px
      left -40px
      z-index 1
      width 120%
      height 120%
      border 5px solid rgba(180, 180, 180, 0.5)
      border-radius 50%

  .header
    position relative
    z-index 2
    display flex
    flex-direction column
    justify-content center
    box-sizing border-box
    padding 0 70px
    width 100%
    height 185px
    border-bottom 5px solid rgba(150, 150, 150, 0.5)
    box-shadow 0px 40px 20px -20px rgba(210, 210, 210, 0.5)

    .title
      overflow hidden
      width 100%
      border none
      background transparent
      color var(--title-color)
      text-overflow ellipsis
      white-space nowrap
      font-weight bold
      font-size 50px

    .info
      overflow hidden
      color var(--info-color)
      text-overflow ellipsis
      white-space nowrap
      font-size 40px

  .message-list
    display flex
    flex 1
    flex-direction column
    overflow-x hidden
    overflow-y auto
    overflow-y overlay
    margin 0 70px 0 50px
    padding 30px 0
    scrollbar-gutter stable
    mask-image linear-gradient(to bottom, transparent, #000 60px, #000, #000 calc(100% - 60px), transparent), linear-gradient(to left, black, transparent 50px)
    mask-size 100% 100%
    mask-position 0 0, 100% 0
    mask-repeat no-repeat, no-repeat

    &::-webkit-scrollbar-track
      position absolute
      top 10px
      margin 30px 0

  .middle
    position relative

    .arrow
      position absolute
      bottom 0
      left 50%
      transform translateX(-50%)
      pointer-events none

.header-fade-enter-active
  transition all 0.5s ease-out

.header-fade-leave-active
  position absolute
  opacity 0

.header-fade-enter-from
  opacity 0

.slide-left-enter-active
  transition all 0.25s ease-out

.slide-left-leave-active
  position absolute
  opacity 0

.slide-left-enter-from
  opacity 0
  transform translateX(100px)

.arrow-fade-enter-active
.arrow-fade-leave-active
  transition all 0.2s ease-out

.arrow-fade-enter-from
  opacity 0

.arrow-fade-leave-to
  opacity 0
</style>
