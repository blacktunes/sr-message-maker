<template>
  <Transition
    name="slide-right-first"
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
            <IconBtn
              class="icon"
              :size="80"
              :transition="false"
            >
              <Icon name="message" />
            </IconBtn>
            <span>发送</span>
          </div>
          <div
            class="btn"
            v-if="setting.index"
            @click.stop="handleScreenshotClick"
          >
            <IconBtn
              class="icon"
              :size="80"
              :transition="false"
            >
              <Icon name="save" />
            </IconBtn>
            <span>保存</span>
          </div>
          <div
            class="btn"
            v-if="setting.index"
            @click.stop="handleAutoPlayClick"
          >
            <IconBtn
              class="icon"
              :size="80"
              :transition="false"
            >
              <Icon name="play" />
            </IconBtn>
            <span>播放</span>
          </div>
        </div>
        <div
          class="bubbles-btn"
          @click.stop=";[emoticonClose(), popupManager.open('bubbles')]"
        >
          <Icon name="setting" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import { getNames, getTitle } from '@/assets/scripts/header'
import { popupManager } from '@/assets/scripts/popup'
import { emoticonClose } from '@/components/Message/Emoticon'
import { addNewMessage, message } from '@/store/message'
import { setting } from '@/store/setting'
import { IconBtn } from 'star-rail-vue'
import Icon from './Common/Icon.vue'
import MessageGroup from './Menu/MessageGroup.vue'

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
    overflow-x hidden
    overflow-y auto
    overflow-y overlay
    box-sizing border-box
    padding-right 25px
    width 100%
    height 'calc(100% - %s)' % $btn-height
    scrollbar-gutter stable
    scrollbar-width none

    &::-webkit-scrollbar-track
      margin 15px 0 5px
      background #3c3f46

    &::-webkit-scrollbar-thumb
      background #9ea0a4

  .footer
    display flex
    align-items center
    box-sizing border-box
    margin-top 15px
    padding-top 35px
    width 100%
    height 125px
    border-top var(--menu-border)

    .btn-list
      display flex
      align-items center
      width 90%

      .btn
        display flex
        flex 0 0 25%
        align-items center
        margin-right 20px
        color var(--menu-text-color)
        cursor pointer
        user-select none

        &:hover
          color var(--menu-btn-hover)

          .icon
            box-shadow var(--meni-icon-shadow)

        .icon
          position relative
          display flex
          flex-shrink 0
          justify-content center
          align-items center
          border-radius 50%
          background var(--menu-icon-background-color)

        span
          margin-left 20px
          font-weight bold
          font-size 30px

    .bubbles-btn
      display flex
      justify-content center
      align-items center
      box-sizing border-box
      width 85px
      height 85px
      border 5px solid #767479
      border-radius 50%
      background rgba(0, 0, 0, 0.5)
      cursor pointer

      &:hover
        box-shadow 0 0 5px 0 #fff
</style>
