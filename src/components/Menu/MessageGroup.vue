<template>
  <div class="message-item">
    <div
      class="item"
      :class="{
        highlight: setting.select === title,
      }"
      @click="handelItemClick"
    >
      <div class="avatar">
        <img :src="avatarUrl" alt="" />
      </div>
      <div class="name">{{ title || "未命名短信" }}</div>
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        :style="{
          transform: setting.select === title ? 'rotate(90deg)' : '',
        }"
      >
        <path
          d="M636.416 522.24l-397.824 387.072c-23.552 23.04-23.552 59.904 0 82.432 23.552 23.04 61.44 23.04 84.992 0l440.32-428.032c23.552-23.04 23.552-59.904 0-82.432l-440.32-428.032C311.808 41.472 296.448 35.84 281.088 35.84c-15.36 0-30.72 5.632-42.496 16.896-23.552 23.04-23.552 59.904 0 82.432l397.824 387.072z"
          fill="#595556"
        ></path>
      </svg>
    </div>
    <div
      class="message-list"
      :class="{
        'message-list-highlight': setting.select === title,
      }"
    >
      <div
        class="message"
        :class="{
          'message-highlight': setting.index === item.id,
        }"
        v-for="(item, index) in list"
        :key="`title-${index}`"
        @click="handelMessageClick(item.id)"
      >
        <svg
          style="flex-shrink: 0"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
        >
          <path
            d="M392.533333 806.4L85.333333 503.466667l59.733334-59.733334 247.466666 247.466667L866.133333 213.333333l59.733334 59.733334L392.533333 806.4z"
            fill="#595556"
          ></path>
        </svg>
        <div class="text">{{ getLastMsg(index) }}</div>
        <div
          class="del"
          v-if="item.list.length === 0"
          @click.stop="handelDelClick(item.id)"
        >
          ×
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAvatar } from '@/assets/scripts/avatar'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed } from '@vue/reactivity'

const props = defineProps<{
  title?: string
  list: MessageListItem[]
}>()

const getLastMsg = (index: number) => {
  if (props.list[index].list.length === 0) {
    return '暂无消息'
  }
  if (props.list[index].list[props.list[index].list.length - 1].img) {
    if (props.list[index].list[props.list[index].list.length - 1].emoticon) {
      return `[${props.list[index].list[props.list[index].list.length - 1].emoticon?.replace(' ', '_')}]`
    }
    return '[图片]'
  }
  return props.list[index].list[props.list[index].list.length - 1].text || '暂无消息'
}

const height = computed(() => `${props.list.length * 165}px`)

const handelItemClick = () => {
  if (setting.select === props.title) {
    setting.select = ''
  } else {
    setting.select = props.title
  }
}

const handelMessageClick = (index: number) => {
  setting.index = index
}

const handelDelClick = (index: number) => {
  const id = message.list.findIndex(item => {
    return item.id === index
  })
  if (id !== -1) {
    message.list.splice(id, 1)
  }
}

const avatarUrl = computed(() => {
  if (props.title === '星穹列车一家人') return require('@/assets/images/一家人.jpg')
  if (props.title) {
    return getAvatar(props.title) || require('@/assets/images/群聊.jpg')
  } else {
    return require('@/assets/images/群聊.jpg')
  }
})
</script>

<style lang="stylus" scoped>
.message-item
  color #b7b8ba
  user-select none
  margin-bottom 35px

  .item
    position relative
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 165px
    border 5px solid #595556
    cursor pointer

    &::before
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      background url('~@/assets/images/对话背景.png')
      background-repeat no-repeat
      background-position right
      opacity 0.15

    &::after
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      background linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 60%, rgba(255, 255, 255, 0.1))
      opacity 0.5

    &:hover
      border 5px solid #b5b5b5

    .avatar
      overflow hidden
      width 115px
      height 115px
      margin-left 30px
      border-radius 50%

      img
        width 100%
        height 100%
        border-radius 50%
        object-fit contain
        background #3f3f3f

    .name
      width 480px
      margin-left 30px
      font-size 46px
      font-weight bold
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

    svg
      transition transform 0.2s

  .message-list
    overflow hidden
    max-height 0
    transition max-height 0.2s

    .message
      position relative
      box-sizing border-box
      display flex
      align-items center
      height 115px
      padding 30px 35px 30px 50px
      margin 25px 10px 0 10px
      border 5px solid #595556
      background rgba(0, 0, 0, 0.4)
      cursor pointer

      &:hover
        border 5px solid #f6f6f6

        .del
          opacity 1

      .text
        margin-left 35px
        font-size 40px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        word-break break-word

      .del
        display flex
        align-items center
        justify-content center
        position absolute
        right 10px
        margin-bottom 10px
        width 80px
        height 80px
        font-size 50px
        opacity 0
        cursor pointer

        &:hover
          opacity 1

.highlight
  border 5px solid #b5b5b5 !important

.message-list-highlight
  max-height v-bind(height) !important

.message-highlight
  border 5px solid #ababab !important
  background #eaeaea !important
  color #050505 !important

  path
    fill #050505 !important
</style>
