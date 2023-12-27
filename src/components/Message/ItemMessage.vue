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
          :src="getAvatar(item.key, item.avatar)"
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
            @keydown.enter.prevent.stop="preview ? undefined : blur($event)"
            @keydown.escape.prevent.stop="preview ? undefined : blur($event)"
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
import { autoPlaySetting, setting } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import { getAvatar } from './Message'
import { bubbles } from '@/assets/data/bubbles'

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
@import './BubblesImage.styl'

$del-pos = -100px

.message
  box-sizing border-box
  display flex
  height -moz-fit-content
  height fit-content
  padding 5px 30px 15px 30px
  item()

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
      background var(--avatar-background)
      user-select none
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
      user-select none
      pointer-events none

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
      cursor pointer

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

    img
      background #c3b7a9 !important

  .message-item
    align-items flex-end

    .text-box
      .text
        border-radius 25px 0 25px 25px
        box-shadow 2px 4px #9d9f9f

  .del
    left $del-pos
    right unset !important

.bubbles-0
  .text-box
    .text
      background #d3bb8b !important

bubbles()
  .text-box
    margin 30px 40px !important
    border 1px solid transparent
    border-image-repeat stretch

    .text
      background none !important
      border-radius 0 !important
      box-shadow none !important
      padding 5px !important

.bubbles-1
  bubbles()

  .text-box
    border-image-source $bubbles-1
    border-image-slice 70 85 45 110 fill
    border-image-width 70px 85px 45px 110px
    border-image-outset 35px 60px 25px 65px

    .text
      margin 30px 0 15px 15px !important
      color #fffafb !important

.bubbles-2
  bubbles()

  .text-box
    border-image-source $bubbles-2
    border-image-slice 75 85 60 110 fill
    border-image-width 75px 85px 60px 110px
    border-image-outset 25px 60px 10px 65px

    .text
      margin 35px 0 15px 15px !important
      color #fffafb !important

.bubbles-3
  bubbles()

  .text-box
    border-image-source $bubbles-3
    border-image-slice 86 100 86 100 fill
    border-image-width 86px 100px 86px 100px
    border-image-outset 25px 55px 10px 60px

    .text
      margin 10px 0 20px -5px !important
      color #fffafb !important

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
