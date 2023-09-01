<template>
  <div
    class="message"
    :class="getBubbles(item.key)"
  >
    <transition
      :name="!preview ? (setting.transition ? 'fade-in' : undefined) : 'avatar'"
      appear
    >
      <div
        class="avatar"
        @click.stop="preview ? undefined : emit('avatar')"
      >
        <img
          :src="getUserAvatar(item.key, item.avatar)"
          alt=""
        />
      </div>
    </transition>
    <div class="message-item">
      <transition
        :name="!preview ? (setting.transition ? 'fade-in' : undefined) : 'message'"
        appear
      >
        <div class="name">
          <span>
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
        :name="!preview ? (setting.transition ? 'fade-in' : undefined) : 'message'"
        appear
      >
        <div
          v-if="autoPlaySetting.flag && item.loading"
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
            @keydown.enter.prevent="preview ? undefined : blur($event)"
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
import { user } from '@/assets/data/characterData'
import { autoPlaySetting, setting } from '@/store/setting'
import Icon from '../Common/Icon.vue'

defineProps<{
  item: Message
  preview?: boolean
}>()

const emit = defineEmits<{
  (event: 'avatar'): void
  (event: 'image', emoticon: boolean): void
  (event: 'update', text: string): void
  (event: 'delete'): void
}>()

const getUserAvatar = (key: string, url: string) => {
  if (key === '开拓者') {
    return user[setting.type].avatar || ''
  } else {
    return url
  }
}

const getBubbles = (key: string) => {
  const classList: string[] = []
  if (key === '开拓者') {
    classList.push('right')
    if (setting.bubbles === 1) {
      classList.push('bubbles-1')
    } else {
      classList.push('bubbles-0')
    }
  }
  return classList
}

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
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

$del-pos = -100px

.message
  box-sizing border-box
  display flex
  height -moz-fit-content
  height fit-content
  padding 5px 30px 15px 30px
  item()

  &:hover
    background var(--message-item-background-color)

    .del
      opacity 1 !important

  .avatar
    flex-shrink 0
    overflow hidden
    width var(--message-item-avatar-width)
    height var(--message-item-avatar-width)
    margin 0 var(--message-item-avatar-margin) 0 0
    cursor pointer

    img
      width 100%
      height 100%
      object-fit contain
      background rgba(0, 0, 0, 0.1)
      user-select none
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

  .message-item
    flex 1
    display flex
    flex-direction column
    align-items flex-start
    max-width calc(100% - var(--message-item-avatar-width) - var(--message-item-avatar-margin))

    .name
      position relative
      color var(--message-item-name-color)
      font-size 45px
      width -moz-fit-content
      width fit-content
      max-width calc(100% - var(--message-item-avatar-width) - var(--message-item-avatar-margin) - 160px)

      span
        display block
        overflow hidden
        white-space nowrap
        text-overflow ellipsis

      .del
        display flex
        align-items center
        justify-content center
        position absolute
        right $del-pos
        top 0
        width 60px
        height 60px
        opacity 0
        cursor pointer

        :deep(path)
          fill var(--message-item-name-color)

        &:hover
          opacity 1

    .loading
      box-sizing border-box
      height 145px
      display inline-flex
      padding 35px 0 35px 10px

      div
        width 20px
        height 20px
        margin 0 5px
        background #222
        border-radius 50%
        animation circle 2s linear infinite
        opacity 0

      & div:nth-child(2)
        animation-delay 0.2s

      & div:nth-child(3)
        animation-delay 0.4s

    .img
      max-width 600px
      min-width var(--message-item-img-width)
      margin 40px 40px 0 40px
      user-select none

      img
        width 100%
        cursor pointer

    .text-box
      position relative
      margin-bottom 10px

      .text
        display block
        background #ebebeb
        min-width 20px
        width -moz-fit-content
        width fit-content
        min-height 65px
        padding 35px
        margin-top 15px
        font-size 45px
        color var(--text-color)
        border-radius 0 25px 25px 25px
        word-break break-word
        box-shadow -2px 4px #9d9f9f

      .bg-icon
        z-index 1
        position absolute
        left 50%
        bottom 10px
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

  .del
    left $del-pos
    right unset !important

.bubbles-0
  bubbles-0()

.bubbles-1
  bubbles-1()

.avatar-enter-active
  animation avatar 0.5s ease

@keyframes avatar
  0%
    transform translateY(50%)
    opacity 0

  80%
    transform translateY(-5%)
    opacity 1

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
  transition all 0s
  opacity 0
  position absolute

.message-enter-from
  opacity 0
</style>
