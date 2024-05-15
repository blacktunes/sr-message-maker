<template>
  <div class="message-item">
    <div
      class="item"
      :class="{
        highlight: setting.select === title
      }"
      @click="handleItemClick"
    >
      <div class="avatar">
        <img
          :src="avatarUrl"
          alt=""
        />
      </div>
      <div class="name">{{ title }}</div>
      <Icon
        name="arrow"
        :style="{
          transform: setting.select === title ? 'rotate(90deg)' : ''
        }"
      />
    </div>
    <div
      class="message-list"
      :class="{
        'message-list-highlight': setting.select === title
      }"
    >
      <div
        class="message"
        :class="{
          'message-highlight': setting.index === item.id
        }"
        v-for="(item, index) in showList"
        :key="`title-${index}`"
        @click="handleMessageClick(item.id)"
        @contextmenu.prevent.stop="handleDelClick(item.id, item.length)"
      >
        <div class="icon">
          <Icon
            v-if="item.state === 2"
            name="delete"
            style="flex-shrink: 0"
          />
          <Icon
            v-else-if="item.state === 0"
            name="star"
            style="flex-shrink: 0"
          />
          <Icon
            v-else
            name="check"
            style="flex-shrink: 0"
          />
        </div>
        <div class="text">{{ item.msg }}</div>
        <div
          class="del"
          @click.stop="handleDelClick(item.id, item.length)"
        >
          <Icon name="delete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import avatar_0 from '@/assets/images/avatar/一家人.webp'
import avatar_1 from '@/assets/images/avatar/私聊.webp'
import avatar_2 from '@/assets/images/avatar/群聊.webp'
import { getAssets } from '@/assets/scripts/preload'
import { popupManager } from '@/assets/scripts/popup'
import { emoticonClose } from '@/components/Message/Emoticon'

const props = defineProps<{
  title?: string
  list: MessageListItem[]
  num: number
}>()

const showList = computed(() => {
  const list = []
  for (let i = 0; i < props.list.length; i++) {
    list.push(getLastMsg(i))
  }
  return list
})

const getLastMsg = (index: number) => {
  const list = props.list[index].list

  let msg: string | undefined
  let state: 0 | 1 | 2 | undefined

  if (list.length === 0) {
    msg = '暂无消息'
  } else {
    for (let i = list.length; i--; i > 0) {
      if (msg === undefined) {
        if (list[i].img) {
          if (list[i].emoticon) {
            if (list[i].emoticon?.startsWith('中年人')) {
              msg = '(发了一个中年人土味表情包)'
            } else {
              msg = `[${list[i].emoticon?.replace(' ', '_')}]`
            }
          } else {
            msg = '[图片]'
          }
        } else if (!list[i].mission) {
          msg = list[i].text
        }
      }
      if (state === undefined) {
        if (list[i].mission) {
          state = list[i].mission?.state ?? 0
        }
      }
      if (msg !== undefined && state !== undefined) {
        break
      }
    }
  }

  msg ??= '任务消息'

  return {
    id: props.list[index].id,
    length: list.length,
    msg,
    state
  }
}

const height = computed(() => `${props.list.length * 165}px`)

const handleItemClick = () => {
  if (setting.select === props.title) {
    setting.select = ''
  } else {
    setting.select = props.title
  }
}

const handleMessageClick = (index: number) => {
  setting.index = index
}

const deleteMessage = (index: number) => {
  const id = message.list.findIndex((item) => {
    return item.id === index
  })
  if (id !== -1) {
    message.list.splice(id, 1)
  }
}

const handleDelClick = (index: number, length: number) => {
  emoticonClose()
  if (length > 0) {
    popupManager.open('confirm', {
      title: '删除短信',
      text: ['是否删除该短信？'],
      fn: () => {
        deleteMessage(index)
      }
    })
  } else {
    deleteMessage(index)
  }
}

const getFirstAvatar = (list: MessageListItem) => {
  for (const item of list.list) {
    if (item.key !== '开拓者') return item.avatar
  }
  return ''
}

const avatarUrl = computed(() => {
  if (props.title === '星穹列车一家人') return getAssets(avatar_0).value
  if (props.title) {
    if (props.num > 1) return getAssets(avatar_2).value
    return getFirstAvatar(props.list[0]) || getAssets(avatar_1).value
  } else {
    return getAssets(avatar_2).value
  }
})
</script>

<style lang="stylus" scoped>
.message-item
  margin-bottom 35px
  color var(--menu-text-color)
  user-select none

  .item
    position relative
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 165px
    border var(--menu-border)
    cursor pointer
    transition all 0.2s

    &:before
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      z-index -1
      background url('@/assets/images/对话背景.webp')
      background-position right
      background-repeat no-repeat
      content ''
      opacity 0.15

    &:after
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      z-index -2
      background linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 60%, rgba(255, 255, 255, 0.1))
      content ''
      opacity 0.5

    &:hover
      border var(--menu-border-hover)

      svg
        margin-left 20px

    .avatar
      overflow hidden
      margin-left 30px
      width 115px
      height 115px
      border-radius 50%

      img
        width 100%
        height 100%
        border-radius 50%
        border-radius 50%
        background var(--avatar-background)
        pointer-events none
        user-select none
        object-fit contain
        clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

    .name
      overflow hidden
      margin-left 30px
      width 480px
      text-overflow ellipsis
      white-space nowrap
      font-weight bold
      font-size 46px

    svg
      transition all 0.2s

  .message-list
    display flex
    flex-direction column
    align-items center
    overflow hidden
    max-height 0
    transition max-height 0.2s

    .message
      position relative
      display flex
      align-items center
      box-sizing border-box
      margin 25px 10px 0
      padding 30px 35px 30px 50px
      width 95%
      height 115px
      border var(--menu-border)
      background rgba(0, 0, 0, 0.4)
      cursor pointer
      transition all 0.2s

      :deep(path)
        transition all 0.2s

      &:hover
        background #bab9be
        color var(--message-text-hover-color)

        :deep(path)
          fill var(--message-icon-hover-color)

      .icon
        display flex
        justify-content center
        align-items center
        width 50px
        height 100%

      .text
        overflow hidden
        margin-bottom 5px
        margin-left 35px
        text-overflow ellipsis
        white-space nowrap
        word-break break-word
        font-size 40px

      .del
        position absolute
        right 10px
        display flex
        justify-content center
        align-items center
        width 80px
        height 80px
        border-radius 10px
        background rgba(255, 255, 255, 0.1)
        opacity 0
        cursor pointer
        backdrop-filter blur(10px)

        &:hover
          opacity 1

.highlight
  border var(--menu-border-hover) !important

.message-list-highlight
  max-height v-bind(height) !important

.message-highlight
  border var(--menu-border-highlight) !important
  background #eaeaea !important
  box-shadow var(--meni-icon-shadow)
  color var(--message-text-hover-color) !important

  :deep(path)
    fill var(--message-icon-hover-color) !important
</style>
