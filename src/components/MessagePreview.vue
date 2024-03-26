<template>
  <template v-if="setting.index">
    <Transition name="fade">
      <div
        class="bg"
        v-show="setting.preview"
      >
        <Transition name="fade">
          <div
            class="green"
            v-show="isGreenScreen"
          ></div>
        </Transition>
        <div
          class="green-btn"
          title="切换背景"
          @click.stop="toggleGreenScreen"
          :class="{ highlight: isGreenScreen }"
        >
          <Icon name="green" />
        </div>
      </div>
    </Transition>
    <Transition
      :name="isGreenScreen ? 'preview-delay' : 'preview'"
      appear
    >
      <MessageBox
        v-show="setting.preview"
        class="message-preview"
        :index="messageIndex"
        :title="title"
        :info="info"
        :playing="autoPlay.flag"
        preview
        @click.stop="autoPlay.flag ? stopPlay() : undefined"
        ref="boxRef"
      >
        <MessageItem
          v-for="(element, index) in dataList"
          :key="`preview-${index}`"
          :item="element"
          :index="0"
          preview
        />
        <template #bottom>
          <Transition
            name="option"
            @after-enter="onOptionShow"
          >
            <div
              class="option-box"
              @click.stop
              v-if="autoPlay.flag && autoPlay.option.length > 0"
            >
              <div
                class="option"
                v-for="(item, key) in autoPlay.option"
                :key="key"
                @click.stop="handleOptionClick(item)"
              >
                {{ item.text }}
              </div>
            </div>
          </Transition>
        </template>
      </MessageBox>
    </Transition>
  </template>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import { screenshot } from '@/assets/scripts/screenshot'
import { messageIndex, currentMessage } from '@/store/message'
import { setting } from '@/store/setting'
import { autoPlay } from '@/store/autoPlay'
import Icon from './Common/Icon.vue'
import { info, scrollToBottom, title } from './Message/Message'
import MessageBox from './Message/MessageBox.vue'
import MessageItem from './Message/MessageItem.vue'
import { closeWindow, isLoading, openWindow } from '@/assets/scripts/popup'

const boxRef = ref<InstanceType<typeof MessageBox>>()

// 要显示的数据
const dataList = computed(() => {
  if (!currentMessage.value) return []
  if (autoPlay.flag || autoPlay.list.length > 0) return autoPlay.list

  const list: (Message & { default?: [boolean] })[] = []
  currentMessage.value.list.forEach((item) => {
    if (item.option) {
      if (!list[list.length - 1] || !list[list.length - 1].default) {
        list.push({
          ...item,
          default: [item.option[0]],
          option: undefined
        })
      } else {
        if (!list[list.length - 1].default?.[0] && item.option[0]) {
          list[list.length - 1].text = item.text
          list[list.length - 1].default = [item.option[0]]
        }
      }
    } else {
      list.push(item)
    }
  })
  return list
})

let optionIndex = 0
let autoPlayIndex = -1

const reset = () => {
  optionIndex = 0
  autoPlayIndex = -1
  autoPlay.list = []
  autoPlay.option = []
}

let timer: number
emitter.on('autoplay', () => {
  if (autoPlay.flag) return

  isGreenScreen.value = JSON.parse(localStorage.getItem('sr-message-screen') || 'false')
  setting.preview = true
  reset()
  autoPlay.flag = true

  timer = setTimeout(() => {
    nextTick(() => {
      next(0, true)
    })
  }, 1000)
})

const onOptionShow = () => {
  scrollToBottom(boxRef.value?.listDom, true)
}

const handleOptionClick = (item: Message) => {
  autoPlay.option = []
  autoPlay.list.push({ ...item, option: undefined })
  setTimeout(() => {
    next(optionIndex, true)
  }, 1500)
}

const next = (i: number, loading: boolean) => {
  if (!autoPlay.flag) return
  if (!currentMessage.value) return

  if (!currentMessage.value.list[i]) {
    autoPlay.flag = false
    return
  }

  if (currentMessage.value.list[i].option) {
    optionIndex = i + 1
    autoPlay.option.push(currentMessage.value.list[i])
    if (currentMessage.value.list[optionIndex] && currentMessage.value.list[optionIndex].option) {
      autoPlayIndex = optionIndex
      next(optionIndex, true)
    }
    return
  }
  autoPlayIndex = i

  if (currentMessage.value.list[i].key === '开拓者' || currentMessage.value.list[i].notice) {
    loading = false
    autoPlay.list.push(currentMessage.value.list[i])
  } else {
    if (loading) {
      autoPlay.list.push({
        ...currentMessage.value.list[i],
        loading: true
      })
    } else {
      autoPlay.list[autoPlay.list.length - 1].loading = false
    }
  }

  nextTick(() => {
    if (!currentMessage.value) return

    scrollToBottom(boxRef.value?.listDom)

    if (loading) {
      const time = Math.min(Math.max(currentMessage.value.list[i].text.length * 50, 1000), 3000)

      clearTimeout(timer)
      timer = setTimeout(() => {
        next(i, false)
      }, time)
    } else {
      if (currentMessage.value.list[i + 1]) {
        let time = currentMessage.value.list[i + 1].interval
        if (time === undefined || time < 1000) {
          time = currentMessage.value.list[i + 1].key === '开拓者' ? 2000 : 1500
        }
        clearTimeout(timer)
        timer = setTimeout(() => {
          next(i + 1, true)
        }, time)
      } else {
        autoPlay.flag = false
      }
    }
  })
}

emitter.on('stopplay', () => stopPlay())

// 取消播放
const stopPlay = () => {
  clearTimeout(timer)
  if (!currentMessage.value) return

  autoPlay.flag = false
  const list: (Message & { default?: [boolean] })[] = []
  for (let j = autoPlayIndex + 1; j < currentMessage.value.list.length; j++) {
    if (currentMessage.value.list[j].option) {
      if (!list[list.length - 1] || !list[list.length - 1].default) {
        list.push({
          ...currentMessage.value.list[j],
          default: [!!currentMessage.value.list[j].option?.[0]],
          option: undefined
        })
      } else {
        if (!list[list.length - 1].default?.[0] && currentMessage.value.list[j].option?.[0]) {
          list[list.length - 1].text = currentMessage.value.list[j].text
          list[list.length - 1].default = [!!currentMessage.value.list[j].option?.[0]]
        }
      }
    } else {
      list.push(currentMessage.value.list[j])
    }
  }
  autoPlay.list = [...autoPlay.list, ...list]
  scrollToBottom(boxRef.value?.listDom)
}

emitter.on('screenshot', () => {
  if (isLoading()) return
  reset()

  isGreenScreen.value = false
  setting.preview = true
  openWindow('loading')
  nextTick(async () => {
    if (boxRef.value?.boxDom && boxRef.value?.listDom && setting.preview) {
      await screenshot(boxRef.value.boxDom, undefined, boxRef.value.listDom.scrollHeight + 185)
    }
    closeWindow('loading')
  })
})

const isGreenScreen = ref(false)
isGreenScreen.value = JSON.parse(localStorage.getItem('sr-message-screen') || 'false')
const toggleGreenScreen = () => {
  isGreenScreen.value = !isGreenScreen.value
  localStorage.setItem('sr-message-screen', JSON.stringify(isGreenScreen.value))
}
</script>

<style lang="stylus" scoped>
@import './Message/Message.styl'
@import './Common/Window.styl'

.bg
  position absolute
  z-index 9
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.6)
  box-shadow 0 0 20px 0px rgba(0, 0, 0, 0.5)
  backdrop-filter blur(20px)
  -webkit-backdrop-filter blur(20px)

  .green
    position absolute
    top 50%
    left 50%
    width 95%
    height 95%
    background-color green
    transition 0.2s
    transform translate(-50%, -50%)

  .green-btn
    position absolute
    right 80px
    bottom -75px
    display flex
    justify-content center
    align-items center
    border-radius 15px
    background #666
    cursor pointer
    transition background 0.2s
    user-select none

    &:hover
      &:before
        position absolute
        top -10px
        right -10px
        bottom -10px
        left -10px
        border 5px solid #666
        border-radius 10px
        content ''

  .highlight
    background none

.message-preview
  position absolute
  top 10%
  left 900px
  z-index 10
  width 1400px
  height 80%
  message()

  :deep(*)
    cursor auto !important

  .option-box
    z-index 9
    overflow-y auto
    padding 10px 50px
    height 90px * 3 + 20px * 4
    border-top var(--menu-border-hover)
    background var(--message-menu-background-color)
    scrollbar-width none

    &::-webkit-scrollbar
      width 0
      height 0

    .option
      display flex
      justify-content center
      align-items center
      option()
      margin 20px 0
      cursor pointer !important
      user-select none

.option-enter-active
  transition all 0.25s

.option-leave-active
  transition all 0.15s

.option-enter-from
  height 0 !important

.option-leave-to
  opacity 0

.preview-enter-active
  transition all 0.3s

.preview-delay-enter-active
  transition all 0.3s
  transition-delay 0.5s

.preview-enter-from
.preview-delay-enter-from
  opacity 0
  transform scaleY(0)
</style>
