<template>
  <Transition
    name="slide-right"
    appear
  >
    <div class="menu">
      <div class="list">
        <MessageGroup
          v-for="item in list"
          :key="item.title"
          :title="item.title"
          :list="item.list"
          :num="item.num"
        />
      </div>
      <div class="footer">
        <div class="btn-list">
          <div
            class="btn"
            @click="handleMessageClick"
          >
            <div class="icon">
              <Icon
                name="ring"
                class="ring"
              />
              <Icon name="message" />
            </div>
            <span>发送</span>
          </div>
          <div
            class="btn"
            v-if="setting.index"
            @click.stop="handleScreenshotClick"
          >
            <div class="icon">
              <Icon
                name="ring"
                class="ring"
              />
              <Icon name="save" />
            </div>
            <span>保存</span>
          </div>
          <div
            class="btn"
            v-if="setting.index"
            @click.stop="handleAutoPlayClick"
          >
            <div class="icon">
              <Icon
                name="ring"
                class="ring"
              />
              <Icon name="play" />
            </div>
            <span>播放</span>
          </div>
        </div>
        <div
          class="bubbles-btn"
          @click.stop=";[emoticonClose(), openWindow('setting')]"
        >
          <Icon name="setting" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import Icon from './Common/Icon.vue'
import MessageGroup from './Menu/MessageGroup.vue'
import { setting } from '@/store/setting'
import { addNewMessage, message } from '@/store/message'
import { emitter } from '@/assets/scripts/event'
import { getNames, getTitle } from '@/assets/scripts/header'
import { openWindow } from '@/assets/scripts/popup'
import { emoticonClose } from '@/components/Message/Emoticon'

interface MenuItem {
  time: number
  title?: string
  list: MessageListItem[]
  num: number
}

const setListItem = (
  list: MenuItem[],
  messageList: MessageListItem,
  num: number,
  title?: string
) => {
  const index = list.findIndex((item) => item.title === (messageList.title || title))
  if (index !== -1) {
    list[index].list.unshift(messageList)
    list[index].time = Math.max(list[index].time, messageList.time)
    list[index].list.sort((a, b) => b.time - a.time)
  } else {
    list.unshift({
      title: messageList.title || title,
      time: messageList.time,
      list: [messageList],
      num
    })
  }
}

const list = computed(() => {
  const temp: MenuItem[] = []
  message.list.forEach((item) => {
    const names = getNames(item.list)[0]
    setListItem(temp, item, names.length, getTitle(names))
  })

  temp.sort((a, b) => b.time - a.time)

  return temp
})

const handleMessageClick = () => {
  addNewMessage(
    list.value.some((i) => i.list.some((j) => j.title === setting.select))
      ? setting.select
      : undefined
  )
}

const handleScreenshotClick = () => {
  if (setting.preview) return
  emoticonClose()
  emitter.emit('screenshot')
}

const handleAutoPlayClick = () => {
  if (setting.preview) return
  emoticonClose()
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
    align-items center
    box-sizing border-box
    width 100%
    height 125px
    border-top var(--menu-border)
    padding-top 35px
    margin-top 15px

    .btn-list
      width 90%
      display flex
      align-items center

      .btn
        flex 0 0 25%
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
          flex-shrink 0
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

    .bubbles-btn
      box-sizing border-box
      width 85px
      height 85px
      display flex
      justify-content center
      align-items center
      background rgba(0, 0, 0, 0.5)
      border-radius 50%
      border 5px solid #767479
      cursor pointer

      &:hover
        box-shadow 0 0 5px 0 #fff
</style>
