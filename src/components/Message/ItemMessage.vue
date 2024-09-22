<template>
  <div
    class="message"
    :class="getBubbles(item.key)"
  >
    <transition
      :name="!preview ? (!state.drag ? 'fade-in' : undefined) : 'avatar'"
      appear
    >
      <div
        class="avatar"
        @click.stop="preview ? undefined : emit('avatar')"
      >
        <img
          :src="getAvatar(item.key, item.avatar)"
          alt=""
        />
      </div>
    </transition>
    <div class="message-item">
      <transition
        :name="!preview ? (!state.drag ? 'fade-in' : undefined) : 'message'"
        appear
      >
        <div class="name">
          <span @click.stop="preview ? undefined : emit('config')">
            {{ item.key === '开拓者' ? setting.name : item.name }}
          </span>
          <div
            v-if="!preview"
            class="del"
            @click="emit('delete')"
          >
            <Icon
              name="delete"
              width="30"
              height="30"
            />
          </div>
        </div>
      </transition>
      <transition
        :name="!preview ? (!state.drag ? 'fade-in' : undefined) : 'message'"
        appear
      >
        <div
          v-if="autoPlay.flag && item.loading"
          class="loading"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          class="img"
          v-else-if="item.img"
          :style="{
            width: item.emoticon ? 'var(--message-item-img-width)' : ''
          }"
        >
          <img
            :src="item.img"
            alt=""
            @click.stop="preview ? undefined : emit('image', !!item.emoticon)"
          />
        </div>
        <div
          v-else
          class="text-box"
        >
          <div
            class="text"
            :contenteditable="!preview"
            @keydown="preview ? undefined : onKeydown($event)"
            @blur="preview ? undefined : updateMessage($event)"
          >
            {{ item.text }}
          </div>
          <Icon
            contenteditable="false"
            class="bg-icon"
            name="train"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { bubbles } from '@/assets/data/bubbles'
import { autoPlay } from '@/store/autoPlay'
import { setting, state } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import { getAvatar, onKeydown } from './Message'

defineProps<{
  item: Message
  preview?: boolean
}>()

const emit = defineEmits<{
  (event: 'avatar'): void
  (event: 'image', emoticon: boolean): void
  (event: 'update', text: string): void
  (event: 'delete'): void
  (event: 'config'): void
}>()

const getBubbles = (key: string) => {
  const classList: string[] = []
  if (key === '开拓者') {
    classList.push('right')
    if (setting.bubbles > 0 && setting.bubbles <= bubbles.length - 1) {
      classList.push(`bubbles-${setting.bubbles}`)
    } else {
      classList.push('bubbles-0')
    }
  }
  return classList
}

const updateMessage = (e: Event) => {
  if (e.target) {
    let text = (e.target as HTMLElement).innerText
    if (text.length < 1) {
      text = DEFAULT_TEXT
      ;(e.target as HTMLElement).innerText = DEFAULT_TEXT
    }
    emit('update', text)
  }
}
</script>

<style lang="stylus" scoped>
@import './Message.styl'
@import '../../assets/data/bubbles/style.styl'

$del-pos = -100px

.message
  display flex
  box-sizing border-box
  padding 15px 30px
  height -moz-fit-content
  height fit-content
  item()

  .avatar
    flex-shrink 0
    overflow hidden
    margin 0 var(--message-item-avatar-margin) 0 0
    width var(--message-item-avatar-width)
    height var(--message-item-avatar-width)
    cursor pointer

    img
      width 100%
      height 100%
      border-radius 50%
      background var(--avatar-background)
      pointer-events none
      user-select none
      user-select none
      object-fit contain
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

  .message-item
    display flex
    flex 1
    flex-direction column
    align-items flex-start
    min-height 225px
    max-width calc(100% - var(--message-item-avatar-width) - var(--message-item-avatar-margin))

    .name
      position relative
      max-width calc(100% - var(--message-item-avatar-width) - var(--message-item-avatar-margin) - 160px)
      width -moz-fit-content
      width fit-content
      color var(--message-item-name-color)
      font-size 45px
      cursor pointer

      span
        display block
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

      .del
        position absolute
        top 0
        right $del-pos
        display flex
        justify-content center
        align-items center
        width 60px
        height 60px
        opacity 0
        cursor pointer

        :deep(path)
          fill var(--message-item-name-color)

        &:hover
          opacity 1

    .loading
      display inline-flex
      box-sizing border-box
      padding 35px 0 35px 10px
      height 145px

      div
        margin 0 5px
        width 20px
        height 20px
        border-radius 50%
        background #222
        opacity 0
        animation circle 2s linear infinite

      & div:nth-child(2)
        animation-delay 0.2s

      & div:nth-child(3)
        animation-delay 0.4s

    .img
      margin 40px 40px 0
      min-width var(--message-item-img-width)
      max-width 600px
      user-select none

      img
        width 100%
        cursor pointer

    .text-box
      box()

      .bg-icon
        position absolute
        bottom 10px
        left 50%
        z-index 1
        height 100px
        transform translateX(-50%)
        pointer-events none

        :deep(path)
          fill rgba(100, 100, 100, 0.005)

.right
  flex-direction row-reverse

  .avatar
    margin 0 0 0 var(--message-item-avatar-margin) !important

  .message-item
    align-items flex-end

    .text-box
      .text
        border-radius 25px 0 25px 25px
        box-shadow 2px 4px #9d9f9f

  .del
    right unset !important
    left $del-pos

.avatar-enter-active
  animation avatar 0.5s ease

@keyframes avatar
  0%
    opacity 0
    transform translateY(50%)

  80%
    opacity 1
    transform translateY(-5%)

  100%
    transform translateY(0)

@keyframes circle
  0%
    opacity 0

  33%
    opacity 1

  66%
    opacity 0

  100%
    opacity 0

.message-enter-active
  transition all 0.5s

.message-leave-active
  position absolute
  opacity 0
  transition all 0s

.message-enter-from
  opacity 0
</style>
