<template>
  <div class="menu">
    <div class="list">
      <MessageGroup
        v-for="item in list"
        :key="item.title"
        :title="item.title"
        :list="item.list"
      />
    </div>
    <div class="footer">
      <div
        class="btn"
        @click="handelMessageAddClick"
      >
        <div class="icon">
          <Icon
            name="ring"
            class="ring"
          />
          <Icon name="message" />
        </div>
        <span>发短信</span>
      </div>
      <div
        class="btn"
        v-if="setting.index"
        @click.stop="handelScreenshotClick"
      >
        <div class="icon">
          <Icon
            name="ring"
            class="ring"
          />
          <Icon name="save" />
        </div>
        <span>保存对话</span>
      </div>
      <div
        class="btn"
        v-if="setting.index"
        @click.stop="handelAutoPlayClick"
      >
        <div class="icon">
          <Icon
            name="ring"
            class="ring"
          />
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
import { getNames, getTitle } from '@/assets/scripts/header'

interface MenuItem {
  time: number
  title?: string
  list: MessageListItem[]
}

const setListItem = (list: MenuItem[], messageList: MessageListItem, title?: string) => {
  const index = list.findIndex((item) => item.title === (messageList.title || title))
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
  message.list.forEach((item) => {
    setListItem(temp, item, getTitle(getNames(item.list)[0]))
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
  setting.select = '未命名短信'
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
$btn-height = 255px

.menu
  position absolute
  top $pos
  left $pos
  width 765px
  height 'calc(100% - %s)' % $pos

  .list
    overflow-y auto
    overflow-y overlay
    overflow-x hidden
    scrollbar-gutter stable
    box-sizing border-box
    width 100%
    height 'calc(100% - %s)' % $btn-height
    padding-right 25px
    scrollbar-width none

    &::-webkit-scrollbar-track
      background #3c3f46
      margin 15px 0 5px 0

    &::-webkit-scrollbar-thumb
      background #9ea0a4

  .footer
    display flex
    align-items flex-start
    box-sizing border-box
    width 100%
    height $btn-height
    border-top var(--menu-border)
    padding-top 35px
    margin-top 15px

    .btn
      flex 0 0 30%
      display flex
      align-items center
      color var(--menu-text-color)
      margin-right 20px
      user-select none
      cursor pointer

      &:hover
        color var(--menu-btn-hover)

        .icon
          box-shadow var(--meni-icon-shadow)

      .icon
        position relative
        background var(--menu-icon-background-color)
        border-radius 50%
        width 80px
        height 80px
        display flex
        justify-content center
        align-items center

        .ring
          position absolute

      span
        margin-left 20px
        font-size 30px
        font-weight bold
</style>
