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
          <template #item="{ element, index }: { element: Message, index: number }">
            <MessageItem
              :style="setMessageStyle(index)"
              :item="element"
              :index="index"
              @option="handelOptionChange(index)"
              @mission="(data) => updateMission(index, data)"
              @text="(data) => updateText(index, data)"
              @avatar="handelAvatarClick(index)"
              @image="handelImageClick(index)"
              @delete="handelDelClick(index)"
            />
          </template>
        </draggable>
        <template #bottom>
          <div class="bottom">
            <div
              class="avatar"
              @click.stop="handelSelectClick"
              title="选择角色"
            >
              <img
                :src="getUserAvatar(input.character.key, getAvatar(input.character.key))"
                alt=""
              />
            </div>
            <input
              type="text"
              class="input"
              v-model="input.input"
              @keydown.enter="handelAddClick()"
              :placeholder="defaultText"
            />
            <div
              class="btn"
              @click="handelImageAddClick"
              title="发送图片"
            >
              <Icon name="image" />
            </div>
            <div
              class="btn"
              @click.stop="handelEmoticonClick"
              title="发送表情"
            >
              <Icon name="emoticon" />
            </div>
            <div
              class="btn"
              @click="handelOptionClick"
              title="创建选项"
            >
              <Icon name="option" />
            </div>
            <div
              class="btn"
              @click="handelMessageClick"
              title="创建任务"
            >
              <Icon name="mission" />
            </div>

            <div
              class="btn"
              @click="handelNoticeClick"
              title="发送通知"
            >
              <Icon name="notice" />
            </div>
            <div
              class="btn right"
              @click="handelAddClick()"
              title="发送消息"
            >
              <Icon name="send" />
            </div>
          </div>
          <Emoticon @emoticon="addEmoticon" />
        </template>
      </MessageBox>
    </template>
    <template v-else>
      <div class="defalut-wrapper">
        <Icon name="train" />
        <span>{{ message.list.length > 0 ? '请选择联系人' : '暂无短信' }}</span>
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
import { computed, nextTick, ref, watch } from 'vue'
import Icon from './Common/Icon.vue'
import Emoticon from './Message/Emoticon.vue'
import { getUserAvatar, info, messageIndex, scrollToBottom, title } from './Message/Message'
import MessageBox from './Message/MessageBox.vue'
import MessageItem from './Message/MessageItem.vue'
import { compressImage } from '@/assets/scripts/image'

const defaultText = DEFAULT_TEXT

const boxRef = ref<InstanceType<typeof MessageBox>>()

const getKey = (item: Message) => {
  const index = message.list[messageIndex.value].list.indexOf(item)
  return `${message.list[messageIndex.value].id}-${index}`
}

watch(messageIndex, () => {
  if (messageIndex.value === -1) {
    setting.index = undefined
  } else {
    nextTick(() => {
      scrollToBottom(boxRef.value?.listDom, true)
      boxRef.value?.updateArrow()
    })
  }
})

const messageList = computed(() => message.list[messageIndex.value]?.list || [])
watch(
  messageList,
  () => {
    let index = message.list[messageIndex.value]?.list.length || 0
    for (const i in message.list[messageIndex.value]?.list) {
      if (message.list[messageIndex.value].list[Number(i)].option) {
        if (message.list[messageIndex.value].list[Number(i)].option?.[0]) {
          if (Number(i) > index) {
            message.list[messageIndex.value].list[Number(i)].option = [false]
          } else {
            index = Number(i)
          }
        }
      } else {
        index = message.list[messageIndex.value].list.length
      }
    }
  },
  {
    deep: true
  }
)

const getCharacter = () => {
  return {
    key: input.character.key,
    name: input.character.name,
    avatar: getAvatar(input.character.key)
  }
}

const setMessageStyle = (key: number) => {
  return {
    marginTop:
      message.list[messageIndex.value].list?.[key]?.option &&
      message.list[messageIndex.value].list?.[key - 1] &&
      !message.list[messageIndex.value].list?.[key - 1]?.option
        ? '100px'
        : '',
    marginBottom:
      message.list[messageIndex.value].list?.[key]?.option &&
      message.list[messageIndex.value].list?.[key + 1] &&
      !message.list[messageIndex.value].list?.[key + 1]?.option
        ? '100px'
        : ''
  }
}

watch(title, () => {
  if (title.value) setting.select = title.value
})

const updateTitle = (data: string) => {
  message.list[messageIndex.value].title = data
}

const updateOption = (key: number, next: boolean) => {
  if (message.list[messageIndex.value].list?.[key]?.option) {
    message.list[messageIndex.value].list[key].option = [false]
    updateOption(next ? key + 1 : key - 1, next)
  }
}

const handelOptionChange = (key: number) => {
  if (!message.list[messageIndex.value].list[key].option) return

  if (message.list[messageIndex.value].list[key].option?.[0]) {
    message.list[messageIndex.value].list[key].option = [false]
  } else {
    message.list[messageIndex.value].list[key].option = [true]
    updateOption(key + 1, true)
    updateOption(key - 1, false)
  }
}

const updateMission = (key: number, data: Mission) => {
  message.list[messageIndex.value].list[key].mission = data
}

const updateText = (key: number, data: string) => {
  message.list[messageIndex.value].list[key].text = data
  message.list[messageIndex.value].time = Date.now()
  nextTick(() => {
    boxRef.value?.updateArrow()
  })
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
      compressImage(el.files[0], 1000).then((img) => {
        delete message.list[messageIndex.value].list[key].emoticon
        message.list[messageIndex.value].list[key].img = img
        message.list[messageIndex.value].time = Date.now()
      })
    }
  }
  el.click()
}
const handelDelClick = (key: number) => {
  message.list[messageIndex.value].list.splice(key, 1)
  message.list[messageIndex.value].time = Date.now()
  nextTick(() => {
    boxRef.value?.updateArrow()
  })
}

const handelSelectClick = () => {
  input.select = true
}

const handelOptionClick = () => {
  message.list[messageIndex.value].list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.input || DEFAULT_TEXT,
    option: [false]
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}

const handelMessageClick = () => {
  message.list[messageIndex.value].list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.input || DEFAULT_TEXT,
    mission: {
      type: 0,
      state: 0
    }
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}

const handelImageAddClick = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      compressImage(el.files[0], 1000).then((img) => {
        message.list[messageIndex.value].list.push({
          ...getCharacter(),
          text: '',
          img: img
        })
        message.list[messageIndex.value].time = Date.now()
        scrollToBottom(boxRef.value?.listDom)
      })
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
    text: input.input || DEFAULT_TEXT,
    notice: true
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}

const handelAddClick = (img?: string) => {
  message.list[messageIndex.value].list.push({
    ...getCharacter(),
    text: input.input || DEFAULT_TEXT,
    img
  })
  message.list[messageIndex.value].time = Date.now()
  input.input = ''
  scrollToBottom(boxRef.value?.listDom)
}
</script>

<style lang="stylus" scoped>
@import './Message/Message.styl'
@import './Common/Window.styl'

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
    position relative
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 150px
    border-top var(--menu-border-hover)
    background var(--message-menu-background-color)
    padding 0 10px

    .avatar
      position absolute
      left 0
      top 50%
      transform translateY(-50%)
      user-select none
      box-sizing border-box
      overflow hidden
      border-radius 50%
      width 105px
      height 105px
      margin-left 20px
      background #c2c2c2
      cursor pointer

      &:hover
        box-shadow 5px 5px 15px #aaa

      img
        width 100%
        height 100%
        object-fit contain
        border-radius 50%
        clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

    .right
      padding-right 10px
      border-radius 0 50px 50px 0
      margin-right 20px

    .btn
      overflow hidden
      display flex
      align-items center
      justify-content center
      width 100px
      height 100px
      cursor pointer
      background #e8e8e8
      user-select none
      transition box-shadow 0.2s

      :deep(path)
        fill #575B66

      img
        width 100%
        height 100%
        object-fit contain

      &:hover
        box-shadow 5px 5px 15px #aaa

    .input
      flex 1
      height 100px
      background #e8e8e8
      font-size 48px
      margin-left 60px
      padding 0 50px 0 90px
      text-align center
      color #121212
      border none
      outline none
      transition box-shadow 0.2s

      &:focus, &:hover
        box-shadow 5px 5px 15px #aaa
</style>
