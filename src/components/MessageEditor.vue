<template>
  <template v-if="setting.index && currentMessage">
    <transition
      name="fade"
      appear
    >
      <MessageBox
        class="message-editor"
        :index="messageIndex"
        :title="title"
        :info="info"
        @title="updateTitle"
        ref="boxRef"
      >
        <draggable
          v-model="currentMessage.list"
          :item-key="(item: Message) => getKey(item)"
          animation="100"
          delay="100"
          force-fallback="true"
          fallback-class="fallback"
          chosen-class="chosen"
          scroll-sensitivity="50"
          scroll-speed="30"
          @choose="onChoose"
          @unchoose="onUnChoose"
          @clone="onMoveStart"
          @end="onMoveEnd"
          @change="onChange"
        >
          <template #item="{ element, index }: { element: Message, index: number }">
            <MessageItem
              class="message-item"
              :style="setMessageStyle(index)"
              :item="element"
              :index="index"
              @option="handleOptionChange(index)"
              @mission="(data) => updateMission(index, data)"
              @text="(data) => updateText(index, data)"
              @avatar="handleAvatarClick(index)"
              @image="handleImageClick($event, index)"
              @delete="handleDelClick(index)"
              @config=";[emoticonClose(), openWindow('message', index)]"
            />
          </template>
        </draggable>
        <template #bottom>
          <div class="bottom">
            <div
              class="avatar"
              @click.stop="handleSelectClick"
              title="选择角色"
            >
              <img
                :src="getAvatar(input.character.key, getCharaterAvatar(input.character.key))"
                alt=""
              />
            </div>
            <input
              type="text"
              class="input"
              v-model="input.text"
              @keydown.enter.prevent.stop="onEnter"
              @keydown.tab="inputFocus(false)"
              @keydown.escape="inputFocus(false)"
              :placeholder="defaultText"
              ref="inputDom"
            />
            <div
              class="btn"
              @click="handleMissionClick"
              title="创建任务"
            >
              <Icon name="mission" />
            </div>
            <div
              class="btn"
              @click="handleOptionClick"
              title="创建选项"
            >
              <Icon name="option" />
            </div>
            <div
              class="btn"
              @click="handleNoticeClick"
              title="发送通知"
            >
              <Icon name="notice" />
            </div>
            <div
              class="btn"
              @click.stop="handleImageAddClick"
              title="发送图片"
            >
              <Icon name="image" />
            </div>
            <div
              class="btn"
              style="border-radius: 0 50px 50px 0"
              :style="{
                background: emoticonData.show ? '#575B66' : '',
                color: emoticonData.show ? '#e8e8e8' : ''
              }"
              @click.stop="handleEmoticonClick"
              title="发送表情"
            >
              <Icon name="emoticon" />
            </div>
            <div
              class="btn right"
              @click="handleAddClick()"
              title="发送消息"
            >
              <Icon name="send" />
            </div>
          </div>
          <Emoticon @emoticon="setEmoticon" />
        </template>
      </MessageBox>
    </transition>
  </template>
  <template v-else>
    <transition
      :name="appearTransition"
      appear
      @after-appear="appearTransition = ''"
    >
      <div class="defalut-wrapper">
        <Icon name="train" />
        <span>{{ message.list.length > 0 ? '请选择联系人' : '暂无短信' }}</span>
      </div>
    </transition>
  </template>
</template>

<script lang="ts" setup>
import Icon from './Common/Icon.vue'
import Emoticon from './Message/Emoticon/Emoticon.vue'
import MessageBox from './Message/MessageBox.vue'
import MessageItem from './Message/MessageItem.vue'
import draggable from '@marshallswain/vuedraggable'
import { getCharaterAvatar } from '@/assets/scripts/avatar'
import { input } from '@/store/input'
import { messageIndex, currentMessage, message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed, nextTick, ref, watch } from 'vue'
import { getAvatar, info, scrollToBottom, title } from './Message/Message'
import { emitter } from '@/assets/scripts/event'
import { openWindow } from '@/assets/scripts/popup'
import { emoticonClose, emoticonOpen, emoticonData } from './Message/Emoticon'

const appearTransition = ref('slide-left')

const defaultText = DEFAULT_TEXT

const boxRef = ref<InstanceType<typeof MessageBox>>()
const inputDom = ref<HTMLInputElement | null>(null)

let randomKey = 0
const getRandomKey = (): number => {
  const key = (Math.random() * 901) | 0
  if (key !== randomKey) return key
  return getRandomKey()
}

const getKey = (item: Message) => {
  if (!currentMessage.value) return

  const index = currentMessage.value.list.indexOf(item)
  return `${currentMessage.value.id}-${index}-${randomKey}`
}

// 自动滚动到底部
watch(messageIndex, () => {
  if (messageIndex.value === -1) {
    setting.index = undefined
  } else {
    nextTick(() => {
      scrollToBottom(boxRef.value?.listDom, true)
      boxRef.value?.updateArrow()
      inputFocus()
    })
  }
})

// 检查选项是否默认
watch(
  () => currentMessage.value?.list,
  () => {
    if (!currentMessage.value?.list) return

    let index = currentMessage.value.list.length || 0
    for (const i in currentMessage.value.list) {
      if (currentMessage.value.list[Number(i)].option) {
        if (currentMessage.value.list[Number(i)].option?.[0]) {
          if (Number(i) > index) {
            currentMessage.value.list[Number(i)].option = [false]
          } else {
            index = Number(i)
          }
        }
      } else {
        index = currentMessage.value.list.length
      }
    }
  },
  {
    deep: true
  }
)

// 调整选项样式
const setMessageStyle = (key: number) => {
  if (!currentMessage.value) return

  return {
    marginTop:
      currentMessage.value.list[key].option &&
      currentMessage.value.list[key - 1] &&
      !currentMessage.value.list[key - 1]?.option
        ? '100px'
        : '',
    marginBottom:
      currentMessage.value.list[key]?.option &&
      currentMessage.value.list[key + 1] &&
      !currentMessage.value.list[key + 1]?.option
        ? '100px'
        : ''
  }
}

watch(title, () => {
  if (title.value) setting.select = title.value
})

const updateTitle = (data: string) => {
  if (!currentMessage.value) return

  currentMessage.value.title = data
}

const updateOption = (key: number, next: boolean) => {
  if (!currentMessage.value) return

  if (currentMessage.value.list[key]?.option) {
    currentMessage.value.list[key].option = [false]
    updateOption(next ? key + 1 : key - 1, next)
  }
}

const handleOptionChange = (key: number) => {
  if (!currentMessage.value) return
  if (!currentMessage.value.list[key].option) return

  if (currentMessage.value.list[key].option?.[0]) {
    currentMessage.value.list[key].option = [false]
  } else {
    currentMessage.value.list[key].option = [true]
    updateOption(key + 1, true)
    updateOption(key - 1, false)
  }
}

const updateMission = (key: number, data: Mission) => {
  if (!currentMessage.value) return

  currentMessage.value.list[key].mission = data
}

const updateText = (key: number, data: string) => {
  if (!currentMessage.value) return

  currentMessage.value.list[key].text = data
  currentMessage.value.time = Date.now()
  nextTick(() => {
    boxRef.value?.updateArrow()
  })
}

const handleAvatarClick = (key: number) => {
  emoticonClose()
  openWindow('character', [messageIndex.value, key])
}

const handleImageClick = async (emoticon: boolean, key: number) => {
  emoticonClose()
  if (emoticon) {
    emoticonOpen([messageIndex.value, key])
  } else {
    openWindow('cropper', { maxWidth: 1280 }).then(({ base64 }) => {
      if (!currentMessage.value) return

      currentMessage.value.list[key].img = base64
      currentMessage.value.time = Date.now()
    })
  }
}
const handleDelClick = (key: number) => {
  if (!currentMessage.value) return

  currentMessage.value.list.splice(key, 1)
  currentMessage.value.time = Date.now()
  nextTick(() => {
    boxRef.value?.updateArrow()
  })
}

const handleSelectClick = () => {
  emoticonClose()
  openWindow('character')
}

emitter.on('focus', () => {
  inputFocus()
})

const inputFocus = (flag = true) => {
  if (flag) {
    inputDom.value?.focus()
  } else {
    inputDom.value?.blur()
  }
}

const handleOptionClick = () => {
  if (!currentMessage.value) return

  currentMessage.value.list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.text || DEFAULT_TEXT,
    option: [false]
  })
  currentMessage.value.time = Date.now()
  input.text = ''
  scrollToBottom(boxRef.value?.listDom)
  inputFocus()
}

const handleMissionClick = () => {
  if (!currentMessage.value) return

  currentMessage.value.list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.text || DEFAULT_TEXT,
    mission: {
      type: 0,
      state: 0
    }
  })
  currentMessage.value.time = Date.now()
  input.text = ''
  scrollToBottom(boxRef.value?.listDom)
  inputFocus()
}

const getCharacter = () => {
  return {
    key: input.character.key,
    name: input.character.name,
    avatar: getCharaterAvatar(input.character.key)
  }
}

const handleImageAddClick = () => {
  emoticonClose()
  openWindow('cropper', { maxWidth: 1280 }).then(({ base64 }) => {
    if (!currentMessage.value) return

    currentMessage.value.list.push({
      ...getCharacter(),
      text: '',
      img: base64
    })
    currentMessage.value.time = Date.now()
    scrollToBottom(boxRef.value?.listDom)
  })
}

const handleEmoticonClick = () => {
  if (emoticonData.show) {
    emoticonClose()
  } else {
    emoticonOpen()
  }
}

const setEmoticon = (url: string, name: string) => {
  if (!currentMessage.value) return

  if (emoticonData.key) {
    currentMessage.value.list[emoticonData.key[1]].img = url
    currentMessage.value.list[emoticonData.key[1]].emoticon = name
    currentMessage.value.time = Date.now()
  } else {
    currentMessage.value.list.push({
      ...getCharacter(),
      text: '',
      img: url,
      emoticon: name
    })
    currentMessage.value.time = Date.now()
    emoticonData.show = false
    scrollToBottom(boxRef.value?.listDom)
  }
  emoticonData.show = false
}

const handleNoticeClick = () => {
  if (!currentMessage.value) return

  currentMessage.value.list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.text || DEFAULT_TEXT,
    notice: true
  })
  currentMessage.value.time = Date.now()
  input.text = ''
  scrollToBottom(boxRef.value?.listDom)
  inputFocus()
}

const handleAddClick = (img?: string) => {
  if (!currentMessage.value) return

  currentMessage.value.list.push({
    ...getCharacter(),
    text: input.text || DEFAULT_TEXT,
    img
  })
  currentMessage.value.time = Date.now()
  input.text = ''
  scrollToBottom(boxRef.value?.listDom)
  inputFocus()
}

const getName = (index: number) => {
  if (!currentMessage.value) return

  if (index < 0) {
    input.character.key = '开拓者'
    input.character.name = ''
    return
  }
  const prev = currentMessage.value.list[index]
  if (prev.key === input.character.key) {
    getName(index - 1)
  } else {
    input.character.key = prev.key
    input.character.name = prev.name
  }
}

const onEnter = (e: KeyboardEvent) => {
  if (!currentMessage.value) return

  handleAddClick()
  if (e.ctrlKey) {
    getName(currentMessage.value.list.length - 2)
  }
}

let isMove = false

const onChoose = () => {
  emoticonClose()
  setting.transition = false
}

const onUnChoose = () => {
  if (isMove) return
  setting.transition = true
}

const onMoveStart = () => {
  randomKey = getRandomKey()
  isMove = true
}

const onMoveEnd = () => {
  setting.transition = true
  isMove = false
}

const onChange = () => {
  if (!currentMessage.value) return

  currentMessage.value.time = Date.now()
}

const opacity = computed(() => (setting.transition ? 1 : 0))
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

  .message-item
    &:hover
      background var(--message-item-background-color)

      :deep(.change), :deep(.del)
        opacity v-bind(opacity) !important

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
        background var(--avatar-background)
        clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

    .right
      padding 0 10px
      margin 0 20px
      border-radius 50px

    .btn
      overflow hidden
      display flex
      align-items center
      justify-content center
      width 100px
      height 100px
      cursor pointer
      background #e8e8e8
      color #575B66
      user-select none
      transition 0.2s

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

.fallback
  display none !important

.chosen
  cursor grabbing
  background var(--message-item-background-color) !important

  &:before
    content ''
    box-sizing border-box
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    border 3px solid rgba(0, 0, 0, 0.2)
    border-radius 10px
</style>
