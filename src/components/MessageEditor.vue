<template>
  <transition-group name="fade">
    <template v-if="setting.index">
      <MessageBox
        class="message-editor"
        :index="messageIndex"
        :title="title"
        :info="info"
        @title="updateTitle"
        ref="boxRef"
      >
        <draggable
          v-model="message.list[messageIndex].list"
          :item-key="(item: Message) => getKey(item)"
          delay="100"
        >
          <template
            #item="{ element, index }: { element: Message, index: number }"
          >
            <MessageItem
              :item="element"
              :index="index"
              @text="updateText"
              @avatar="handelAvatarClick"
              @image="handelImageClick"
              @delete="handelDelClick"
            />
          </template>
        </draggable>
        <template #bottom>
          <div class="bottom">
            <div class="btn" @click.stop="handelSelectClick" title="选择角色">
              <img
                :src="
                  getUserAvatar(
                    input.character.key,
                    getAvatar(input.character.key)
                  )
                "
                alt=""
              />
            </div>
            <input
              type="text"
              class="input"
              v-model="input.input"
              @keydown.enter="handelAddClick()"
            />
            <div class="btn" @click="handelImageAddClick" title="发送图片">
              <Icon name="image" />
            </div>
            <div class="btn" title="发送表情" @click.stop="handelEmoticonClick">
              <Icon name="emoticon" />
            </div>
            <div class="btn" @click="handelNoticeClick" title="发送通知">
              <Icon name="notice" />
            </div>
            <div class="btn" @click="handelAddClick()" title="发送消息">
              <Icon name="message" width="60" height="60" />
            </div>
          </div>
        </template>
        <Emoticon @emoticon="addEmoticon" />
      </MessageBox>
    </template>
    <template v-else>
      <div class="defalut-wrapper">
        <img src="@/assets/images/列车.svg" alt="" draggable="false" />
        <span>{{ message.list.length > 0 ? "请选择联系人" : "暂无短信" }}</span>
      </div>
    </template>
  </transition-group>
</template>

<script lang="ts" setup>
import { getAvatar } from '@/assets/scripts/avatar'
import { input } from '@/store/input'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import draggable from '@marshallswain/vuedraggable'
import { nextTick, ref, watch } from 'vue'
import { scrollToBottom, useMessage } from './Message/Message'
import Emoticon from './Message/Emoticon.vue'
import MessageBox from './Message/MessageBox.vue'
import MessageItem from './Message/MessageItem.vue'
import Icon from './Common/Icon.vue'

const boxRef = ref<InstanceType<typeof MessageBox>>()

const { messageIndex, title, info, getUserAvatar } = useMessage()

const getKey = (item: Message) => {
  const index = message.list[messageIndex.value].list.indexOf(item)
  return `${message.list[messageIndex.value].id}-${index}`
}

watch(messageIndex, () => {
  if (messageIndex.value === -1) {
    setting.index = undefined
  }
  nextTick(() => {
    scrollToBottom(boxRef.value?.listDom, true)
  })
})

const getCharacter = () => {
  return {
    key: input.character.key,
    name: input.character.name,
    avatar: getAvatar(input.character.key)
  }
}

const updateTitle = (data: string) => {
  message.list[messageIndex.value].title = data
}

const updateText = (key: number, data: string) => {
  message.list[messageIndex.value].list[key].text = data
  message.list[messageIndex.value].time = Date.now()
}

const handelAvatarClick = (key: number) => {
  input.index = [messageIndex.value, key]
  input.select = true
}

const handelImageClick = (key: number) => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = e => {
        delete message.list[messageIndex.value].list[key].emoticon
        message.list[messageIndex.value].list[key].img = e.target?.result as string
        message.list[messageIndex.value].time = Date.now()
      }
    }
  }
  el.click()
}
const handelDelClick = (key: number) => {
  message.list[messageIndex.value].list.splice(key, 1)
  message.list[messageIndex.value].time = Date.now()
}

const handelSelectClick = () => {
  input.select = true
}

const handelImageAddClick = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = e => {
        message.list[messageIndex.value].list.push({
          ...getCharacter(),
          text: '',
          img: e.target?.result as string
        })
        message.list[messageIndex.value].time = Date.now()
        scrollToBottom(boxRef.value?.listDom)
      }
    }
  }
  el.click()
}

const handelEmoticonClick = () => {
  input.emoticon = !input.emoticon
}

const addEmoticon = (url: string, name: string) => {
  message.list[messageIndex.value].list.push({
    ...getCharacter(),
    text: '',
    img: url,
    emoticon: name
  })
  message.list[messageIndex.value].time = Date.now()
  input.emoticon = false
  scrollToBottom(boxRef.value?.listDom)
}

const handelNoticeClick = () => {
  message.list[messageIndex.value].list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.input || '愿此行，终抵群星',
    notice: true
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}

const handelAddClick = (img?: string) => {
  message.list[messageIndex.value].list.push({
    ...getCharacter(),
    text: input.input || '愿此行，终抵群星',
    img
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}
</script>

<style lang="stylus" scoped>
@import './Message/Message.styl'

box()
  position absolute
  top 180px
  left 1000px
  width 2100px
  height 85%

.defalut-wrapper
  display flex
  flex-direction column
  align-items center
  justify-content center
  background rgba(255, 255, 255, 0.1)
  box()
  message()
  box-shadow unset
  user-select none

  span
    color #b0aba5
    user-select none
    font-size 40px
    margin 100px 0 200px 0

.message-editor
  box()
  message()

  .bottom
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 150px
    border-top var(--menu-border)
    background #c7c8ca
    padding 0 10px

    .btn
      overflow hidden
      display flex
      align-items center
      justify-content center
      width 100px
      height 100px
      margin 0 10px
      cursor pointer
      border-radius 5px
      background #e8e8e8
      user-select none

      :deep(path)
        fill #575B66

      img
        width 100%
        height 100%
        object-fit contain

    .input
      flex 1
      height 100px
      margin 0 10px
      background #e8e8e8
      font-size 50px
      text-align center
      color #121212
      border none
      outline none
      box-shadow 5px 5px 15px #aaa
      border-radius 5px
</style>
