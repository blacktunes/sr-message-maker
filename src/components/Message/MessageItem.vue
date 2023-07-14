<template>
  <div
    class="mission"
    v-if="item.mission"
  >
    <transition
      name="fade"
      appear
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
        <div
          v-if="!preview"
          @click.stop="handelTypeClick(item.mission.type)"
          class="icon"
        ></div>
        <div
          class="tip"
          @click.stop="preview ? undefined : handeStateClick(item.mission.state)"
        >
          {{ missionState }}
        </div>
        <div
          v-if="preview"
          class="text"
        >
          {{ item.text }}
        </div>
        <input
          v-else
          class="text"
          :value="item.text"
          @keydown.enter.prevent
          @input="updateText(($event.target as HTMLInputElement).value)"
        />
        <div
          class="state"
          @click.stop="preview ? undefined : handeStateClick(item.mission.state)"
        >
          <Icon
            v-if="item.mission.state === 1"
            :class="item.mission.type === 1 ? 'mission-2' : 'mission-1'"
            name="success"
          />
          <Icon
            v-else-if="item.mission.state === 2"
            :class="item.mission.type === 1 ? 'mission-2' : 'mission-1'"
            name="fail"
          />
          <Icon
            v-else
            name="arrow"
          />
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
    </transition>
  </div>
  <div
    v-else-if="item.notice"
    class="notice"
  >
    <Icon name="warn" />
    <span
      :contenteditable="!preview"
      @keydown.enter.prevent="preview ? undefined : blur($event)"
      @blur="preview ? undefined : updateText(($event.target as HTMLElement).innerText)"
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
          @blur="preview ? undefined : updateText(($event.target as HTMLElement).innerText)"
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
import { computed } from 'vue'
import image_1 from '@/assets/images/冒险任务.png'
import image_2 from '@/assets/images/同行任务.png'

const props = defineProps<{
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

const emit = defineEmits<{
  (event: 'mission', data: Mission): void
  (event: 'text', data: string): void
  (event: 'avatar'): void
  (event: 'image'): void
  (event: 'delete'): void
}>()

const missionState = computed(() => {
  if (props.item.mission?.state === 2) {
    return '任务失败'
  }
  if (props.item.mission?.state === 1) {
    return '任务已完成'
  }
  return '已接取任务'
})

const backgroundUrl = computed(() => {
  return props.item.mission?.type === 1 ? `url(${image_1})` : `url(${image_2})`
})

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
}

const handelTypeClick = (type: number) => {
  const data: Mission = {
    type: type === 1 ? 0 : 1,
    state: props.item.mission?.state ?? 0
  }
  emit('mission', data)
}

const handeStateClick = (state: number) => {
  const data: Mission = {
    type: props.item.mission?.type ?? 0,
    state: state === 0 ? 1 : state === 1 ? 2 : 0
  }
  emit('mission', data)
}

const updateText = (text: string) => {
  console.log(text)
  emit('text', text)
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

.mission
  display flex
  justify-content center
  align-items center
  width 100%
  margin 100px 0

  &:hover
    .bg
      .del
        opacity 1

  .bg
    position relative
    height 180px
    background-repeat no-repeat
    background-position top left
    background-size cover
    border-top-right-radius 50px
    box-shadow 10px 5px 20px 0px rgba(0, 0, 0, 0.1)

    .icon
      position absolute
      top 0
      left 35px
      width 120px
      height 175px
      user-select none
      cursor pointer

    .tip
      position absolute
      top 10px
      left 180px
      color #fff
      font-size 30px
      height 45px
      line-height 45px
      user-select none
      cursor pointer

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
      display flex
      justify-content center
      align-items center
      position absolute
      right 0
      bottom 15px
      width 120px
      height 120px
      user-select none
      cursor pointer

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
  height -moz-fit-content
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

      img
        width 100%
        cursor pointer

    .text
      background #ebebeb
      padding 35px
      margin-top 15px
      width -moz-fit-content
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

.mission-1
  :deep(path)
    fill #b886ed

.mission-2
  :deep(path)
    fill #54a9be

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
