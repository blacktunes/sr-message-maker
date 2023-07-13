<template>
  <div>
    <slot name="top"></slot>
    <div
      class="box"
      ref="boxDom"
    >
      <transition
        name="header-fade"
        appear
      >
        <div
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
              @keydown.enter.prevent
              :value="title"
              @input="updateTitle"
            />
            <div class="info">{{ info }}</div>
          </div>
        </transition>
      </div>
      <div
        class="message-list"
        ref="listDom"
        @scroll="handelScroll($event.target as HTMLElement)"
      >
        <slot></slot>
        <div
          class="mission"
          v-if="mission"
        >
          <div
            class="bg"
            :style="{
              backgroundImage: backgroundUrl,
              width: preview
                ? 'calc(100% - var(--message-item-avatar-margin) * 2)'
                : 'calc(100% - var(--message-item-avatar-width) * 2)'
            }"
          >
            <div class="tip">{{ missionState }}</div>
            <div
              v-if="preview"
              class="text"
            >
              {{ mission.text }}
            </div>
            <input
              v-else
              class="text"
              @keydown.enter.prevent
              :value="mission.text"
              @input="preview ? undefined : updateText($event)"
            />
            <div class="state">
              {{ mission.state }}
            </div>
            <div
              v-if="!preview"
              @click="handelDelClick"
              class="del"
            >
              <Icon
                name="delete"
                width="35"
                height="35"
              />
            </div>
          </div>
        </div>
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
import { computed, ref } from 'vue'
import Icon from '../Common/Icon.vue'
import image_1 from '@/assets/images/冒险任务.png'
import image_2 from '@/assets/images/同行任务.png'

const props = defineProps<{
  index: number
  title: string
  info?: string
  preview?: boolean
  playing?: boolean
  mission?: Mission
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'title', data: string): void
  (event: 'mission', data?: Mission): void
}>()

const boxDom = ref<HTMLElement | null>(null)
const listDom = ref<HTMLElement | null>(null)

const scrollTip = ref(false)

const handelScroll = (el: HTMLElement) => {
  scrollTip.value = el.scrollHeight - (el.scrollTop + el.clientHeight) > 250
}

const updateArrow = () => {
  if (listDom.value) {
    handelScroll(listDom.value)
  }
}

const updateTitle = (e: Event) => {
  emit('title', (e.target as HTMLInputElement).value)
}

const missionState = computed(() => {
  if (props.mission?.state === 2) {
    return '任务失败'
  }
  if (props.mission?.state === 1) {
    return '已完成任务'
  }
  return '已接取任务'
})

const backgroundUrl = computed(() => {
  return props.mission?.type === 1 ? `url(${image_1})` : `url(${image_2})`
})

const updateText = (e: Event) => {
  emit('mission', {
    ...props.mission,
    text: (e.target as HTMLInputElement).innerText
  } as Mission)
}

const handelDelClick = () => {
  emit('mission')
}

defineExpose({ boxDom, listDom, updateArrow })
</script>

<style lang="stylus" scoped>
.box
  display flex
  flex-direction column
  width 100%
  height 100%
  background var(--box-background-color)
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
      width 100%
      color var(--title-color)
      font-size 50px
      font-weight bold
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      background transparent
      border none

    .info
      color var(--info-color)
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

    .mission
      display flex
      justify-content center
      align-items center
      width 100%
      margin 100px 0

      .bg
        position relative
        height 180px
        background-repeat no-repeat
        background-position top left
        background-size cover
        border-top-right-radius 50px
        box-shadow 10px 5px 20px 0px rgba(0, 0, 0, 0.1)

        &:hover
          .del
            opacity 1

        .tip
          position absolute
          top 10px
          left 180px
          color #fff
          font-size 30px
          height 45px
          line-height 45px
          user-select none

        .text
          position absolute
          top 55px
          left 180px
          color #000
          font-size 45px
          line-height 100px
          height 100px
          width 80%
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          background transparent
          border none

        .state
          position absolute
          right 20px
          top 50%
          font-size 30px

        .del
          display flex
          align-items center
          justify-content center
          position absolute
          right -100px
          top 70px
          width 60px
          height 60px
          opacity 0
          cursor pointer

          :deep(path)
            fill var(--message-item-name-color)

          &:hover
            opacity 1

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
  opacity 0
  position absolute

.header-fade-enter-from
  opacity 0

.slide-left-enter-active
  transition all 0.25s ease-out

.slide-left-leave-active
  opacity 0
  position absolute

.slide-left-enter-from
  opacity 0
  transform translateX(100px)

.arrow-fade-enter-active, .arrow-fade-leave-active
  transition all 0.2s ease-out

.arrow-fade-enter-from
  opacity 0

.arrow-fade-leave-to
  opacity 0
</style>
