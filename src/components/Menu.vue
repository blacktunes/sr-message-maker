<template>
  <div class="message">
    <div class="list">
      <MessageItem
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :list="item.list"
      />
    </div>
    <div class="menu">
      <div class="btn" @click="handelMessageAddClick">
        <div class="icon">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
          >
            <path
              d="M950.784 73.187556H73.130667C32.796444 73.187556 0 113.237333 0 162.503111v551.367111c0 49.265778 32.796444 89.344 73.130667 89.344h280.433777l158.350223 147.598222 158.350222-147.598222h280.462222c40.362667 0 73.130667-40.049778 73.130667-89.344V162.503111c0.056889-49.265778-32.711111-89.315556-73.073778-89.315555z m24.348444 640.711111c0 18.346667-10.865778 33.223111-24.348444 33.223111H658.232889v0.568889l-0.341333-0.398223-145.948445 135.992889-145.948444-135.992889-0.341334 0.398223v-0.568889H73.130667c-13.454222 0-24.376889-14.876444-24.376889-33.223111V162.503111c0-18.289778 10.951111-33.166222 24.376889-33.166222h877.624889c13.511111 0 24.348444 14.876444 24.348444 33.166222v551.395556z"
            ></path>
            <path
              d="M781.368889 304.298667H242.488889c-14.876444 0-26.936889 12.544-26.936889 28.017777 0 15.502222 12.060444 28.103111 26.936889 28.103112H781.368889c14.933333 0 27.022222-12.572444 27.022222-28.103112 0-15.473778-12.088889-28.017778-27.022222-28.017777zM511.971556 535.921778H242.488889c-14.876444 0-26.936889 12.572444-26.936889 28.074666s12.060444 28.046222 26.936889 28.046223h269.454222c14.876444 0 26.936889-12.544 26.936889-28.046223s-12.032-28.074667-26.908444-28.074666z"
            ></path>
          </svg>
        </div>
        <span>发短信</span>
      </div>
      <div class="btn" v-if="setting.index" @click.stop="handelScreenshotClick">
        <div class="icon">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
          >
            <path
              d="M835.3 250.9v522.3H188.7V250.9h646.6m49.8-49.8H138.9v621.8H885V201.1h0.1z"
            ></path>
            <path
              d="M138.9 101.6v99.5H64.3v49.8H188.7V101.6zM885.1 922.4v-99.5h74.6v-49.8H835.3v149.3zM511 705.4H297.5c-7.8 0-20.4-2.9-23.3-7.8-2.9-4.9 1.9-16.5 5.8-23.3 26.2-39.8 53.4-79.6 79.6-119.4 8.7-12.6 17.5-13.6 31.1-7.8 44.6 21.4 90.3 42.7 135.9 64.1 12.6 5.8 28.1 1.9 35.9-9.7 24.3-37.9 49.5-74.7 75.7-111.6 4.9-6.8 13.6-17.5 20.4-17.5 7.8 0 13.6 12.6 16.5 20.4 24.3 60.2 47.6 121.3 70.9 181.5 9.7 25.2 5.8 31.1-23.3 31.1H511z m-78.6-298c0 29.1-25.2 52.4-54.4 51.4-29.1-1-51.4-23.3-51.4-51.4 0-29.1 24.3-52.4 54.4-51.4 27.1 0.9 51.4 24.2 51.4 51.4z"
              fill="#707070"
            ></path>
          </svg>
        </div>
        <span>保存对话</span>
      </div>
      <div class="btn" v-if="setting.index" @click.stop="handelAutoPlayClick">
        <div class="icon">
          <svg
            style="margin-left: 5px"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
          >
            <path
              d="M213.333333 896V128a42.666667 42.666667 0 0 1 65.706667-35.882667l597.333333 384a42.666667 42.666667 0 0 1 0 71.765334l-597.333333 384A42.666667 42.666667 0 0 1 213.333333 896z m85.333334-78.165333L774.4 512 298.666667 206.165333v611.669334z"
            ></path>
          </svg>
        </div>
        <span>自动播放</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed } from 'vue'
import MessageItem from './Menu/MessageItem.vue'
import { emitter } from '@/assets/scripts/event'

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

.message
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

  .menu
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

      .icon
        background #e3e3e3
        border-radius 50%
        width 80px
        height 80px
        display flex
        justify-content center
        align-items center

      span
        margin-left 20px
        font-size 30px
        font-weight bold

      path
        fill #707070
</style>
