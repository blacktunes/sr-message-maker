<template>
  <div class="menu">
    <div class="list">
      <MessageGroup
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :list="item.list"
      />
    </div>
    <div class="message">
      <div class="btn" @click="handelMessageAddClick">
        <div class="icon">
          <Icon name="message" />
        </div>
        <span>发短信</span>
      </div>
      <div class="btn" v-if="setting.index" @click.stop="handelScreenshotClick">
        <div class="icon">
          <Icon name="save" />
        </div>
        <span>保存对话</span>
      </div>
      <div class="btn" v-if="setting.index" @click.stop="handelAutoPlayClick">
        <div class="icon">
          <Icon name="play" />
        </div>
        <span>自动播放</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed } from 'vue'
import Icon from './Common/Icon.vue'
import MessageGroup from './Menu/MessageGroup.vue'

interface MenuItem {
  time: number
  title?: string
  list: MessageListItem[]
}

const setListItem = (
  list: MenuItem[],
  messageList: MessageListItem,
  title?: string
) => {
  const index = list.findIndex(item => item.title === (messageList.title || title))
  if (index !== -1) {
    list[index].list.unshift(messageList)
    list[index].time = Math.max(list[index].time, messageList.time)
    list[index].list.sort((a, b) => b.time - a.time)
  } else {
    list.unshift({
      title: messageList.title || title,
      time: messageList.time,
      list: [messageList]
    })
  }
}

const list = computed(() => {
  const temp: MenuItem[] = []
  message.list.forEach(item => {
    const name: string[] = []
    for (const _message of item.list) {
      if (_message.key !== '开拓者' && !name.includes(_message.key)) {
        name.push(_message.key)
      }
    }

    switch (name.length) {
      case 0:
        setListItem(temp, item)
        break
      case 1:
        setListItem(temp, item, name[0])
        break
      default:
        setListItem(temp, item, `${name.join('、')}、${setting.name}的群聊`)
    }
  })

  temp.sort((a, b) => b.time - a.time)

  return temp
})

const handelMessageAddClick = () => {
  const time = Date.now()
  message.list.unshift({
    id: time,
    time,
    list: []
  })
  setting.index = time
  setting.select = undefined
}

const handelScreenshotClick = () => {
  if (setting.preview) return
  emitter.emit('screenshot')
}

const handelAutoPlayClick = () => {
  if (setting.preview) return
  emitter.emit('autoplay')
}
</script>

<style lang="stylus" scoped>
$pos = 190px

.menu
  position absolute
  top $pos
  left $pos
  width 750px
  height 'calc(100% - %s)' % $pos

  .list
    overflow-y scroll
    overflow-x hidden
    width 100%
    height calc(100% - 225px)
    scrollbar-width none

    &::-webkit-scrollbar
      width 0
      height 0

  .message
    display flex
    align-items flex-start
    box-sizing border-box
    width 100%
    height 225px
    border-top 5px solid #595556
    padding-top 35px

    .btn
      flex 0 0 30%
      display flex
      align-items center
      color #ccc
      margin-right 20px
      user-select none
      cursor pointer

      &:hover
        color #e4d89b

        .icon
          outline 3px solid #f8fdff

      .icon
        background #e3e3e3
        border-radius 50%
        width 80px
        height 80px
        display flex
        justify-content center
        align-items center

        :deep(path)
          fill #1a1b18

      span
        margin-left 20px
        font-size 30px
        font-weight bold
</style>
