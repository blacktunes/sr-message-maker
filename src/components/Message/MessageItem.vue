<template>
  <div
    v-if="item.notice"
    class="notice"
  >
    <Icon name="warn" />
    <span
      :contenteditable="!preview"
      @keydown.enter.prevent="preview ? undefined : blur($event)"
      @blur="preview ? undefined : updateText($event)"
    >
      {{ item.text }}
    </span>
    <div v-if="!preview">
      <div
        @click="handelDelClick()"
        class="del"
      >
        <Icon
          name="delete"
          width="30"
          height="30"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="message"
    :class="{
      right: item.key === '开拓者'
    }"
  >
    <transition
      :name="!preview ? 'fade' : 'avatar'"
      appear
    >
      <div
        class="avatar"
        @click.stop="preview ? undefined : handelAvatarClick()"
      >
        <img
          :src="getUserAvatar(item.key, item.avatar)"
          alt=""
        />
      </div>
    </transition>
    <div class="message-item">
      <transition
        :name="!preview ? 'fade' : 'message'"
        appear
      >
        <div class="name">
          <span>
            {{ item.key === '开拓者' ? setting.name : item.name }}
          </span>
          <div
            v-if="!preview"
            class="del"
            @click="handelDelClick()"
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
        :name="!preview ? 'fade' : 'message'"
        appear
      >
        <div
          v-if="item.loading"
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
            @click.stop="preview ? undefined : handelImageClick()"
          />
        </div>
        <div
          v-else
          class="text"
          :contenteditable="!preview"
          @keydown.enter.prevent="preview ? undefined : blur($event)"
          @blur="preview ? undefined : updateText($event)"
        >
          {{ item.text }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { user } from '@/assets/data/characterData'
import { setting } from '@/store/setting'
import Icon from '../Common/Icon.vue'

// TODO 移除index参数
defineProps<{
  item: Message
  preview?: boolean
}>()

const getUserAvatar = (key: string, url: string) => {
  if (key === '开拓者') {
    return user[setting.type].avatar || ''
  } else {
    return url
  }
}

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'text', data: string): void
  (event: 'avatar'): void
  (event: 'image'): void
  (event: 'delete'): void
}>()

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
}

const updateText = (e: Event) => {
  emit('text', (e.target as HTMLInputElement).innerText)
}

const handelAvatarClick = () => {
  emit('avatar')
}

const handelImageClick = () => {
  emit('image')
}

const handelDelClick = () => {
  emit('delete')
}
</script>

<style lang="stylus" scoped>
$del-pos = -100px
$avatar-width = 140px
$avatar-margin = 35px

.notice
  display flex
  justify-content center
  align-items center
  width 100%
  height 60px
  padding 80px 0 20px 0
  font-size 30px
  color var(--notice-color)

  &:hover
    background var(--message-item-background-color)

    div
      .del
        opacity 1

  img
    user-select none

  span
    max-width 80%
    margin-left 20px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis

  div
    position relative
    height 100%

    .del
      display flex
      align-items center
      justify-content center
      position absolute
      right $del-pos
      width 60px
      height 60px
      opacity 0
      cursor pointer

      :deep(path)
        fill var(--notice-color)

      &:hover
        opacity 1

.message
  display flex
  height fit-content
  width 100%
  padding 15px 0

  &:hover
    background var(--message-item-background-color)

    .del
      opacity 1 !important

  .avatar
    flex-shrink 0
    overflow hidden
    border-radius 50%
    width var(--message-item-avatar-width)
    height var(--message-item-avatar-width)
    margin 0 var(--message-item-avatar-margin) 0 0
    cursor pointer

    img
      width 100%
      height 100%
      border-radius 50%
      object-fit contain
      background rgba(0, 0, 0, 0.1)
      user-select none

  .message-item
    flex 1
    display flex
    flex-direction column
    max-width calc(100% - var(--message-item-avatar-width) - var(--message-item-avatar-margin))

    .name
      position relative
      color var(--message-item-name-color)
      font-size 45px
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

      img
        width 100%
        cursor pointer

    .text
      background #ebebeb
      padding 35px
      margin-top 15px
      width fit-content
      font-size 45px
      color var(--text-color)
      border-radius 0 25px 25px 25px
      word-break break-word

.right
  flex-direction row-reverse

  .avatar
    margin 0 0 0 var(--message-item-avatar-margin) !important

  .message-item
    align-items flex-end

    .text
      background #d3bb8b !important
      border-radius 25px 0 25px 25px !important

  .del
    left $del-pos
    right unset !important

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
