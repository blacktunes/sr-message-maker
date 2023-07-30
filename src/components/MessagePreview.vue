<template>
  <template v-if="setting.index">
    <div
      class="bg"
      :style="{ background: isGreenScreen ? 'green' : '' }"
      v-show="setting.preview"
    >
      <div
        class="green"
        title="切换绿幕"
        @click.stop="isGreenScreen = !isGreenScreen"
        v-if="setting.preview"
      >
        <Icon name="green" />
      </div>
    </div>
    <MessageBox
      v-show="setting.preview"
      class="message-preview"
      :index="messageIndex"
      :title="title"
      :info="info"
      :playing="autoPlaySetting.flag"
      preview
      @click.stop="autoPlaySetting.flag ? stopPlay() : undefined"
      ref="boxRef"
    >
      <template
        #top
        v-if="false"
      >
        <div
          class="close"
          style="cursor: pointer !important"
          v-show="!autoPlaySetting.flag"
        >
          <Icon
            name="close"
            @click.stop="setting.preview = false"
          />
        </div>
      </template>
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
            v-if="autoPlaySetting.flag && autoPlaySetting.option.length > 0"
          >
            <div
              class="option"
              v-for="(item, key) in autoPlaySetting.option"
              :key="key"
              @click.stop="handelOptionClick(item)"
            >
              {{ item.text }}
            </div>
          </div>
        </Transition>
      </template>
    </MessageBox>
  </template>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import domtoimage from '@/assets/scripts/screenshot'
import { message } from '@/store/message'
import { autoPlaySetting, setting } from '@/store/setting'
import { computed, nextTick, ref } from 'vue'
import Icon from './Common/Icon.vue'
import { info, messageIndex, scrollToBottom, title } from './Message/Message'
import MessageBox from './Message/MessageBox.vue'
import MessageItem from './Message/MessageItem.vue'

const boxRef = ref<InstanceType<typeof MessageBox>>()

// 要显示的数据
const dataList = computed(() => {
  if (autoPlaySetting.flag || autoPlaySetting.list.length > 0) return autoPlaySetting.list

  const list: (Message & { default?: [boolean] })[] = []
  message.list[messageIndex.value].list.forEach((item) => {
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
let autoPlayIndex = 0

const reset = () => {
  optionIndex = 0
  autoPlayIndex = 0
  autoPlaySetting.list = []
  autoPlaySetting.option = []
}

emitter.on('autoplay', () => {
  if (autoPlaySetting.flag) return

  setting.preview = true
  reset()
  autoPlaySetting.flag = true
  nextTick(() => {
    autoPlay(0, true)
  })
})

const onOptionShow = () => {
  scrollToBottom(boxRef.value?.listDom, true)
}

const handelOptionClick = (item: Message) => {
  autoPlaySetting.option = []
  autoPlaySetting.list.push({ ...item, option: undefined })
  setTimeout(() => {
    autoPlay(optionIndex, true)
  }, 1500)
}

const autoPlay = (i: number, loading: boolean) => {
  if (!autoPlaySetting.flag) return
  if (!message.list[messageIndex.value].list?.[i]) {
    autoPlaySetting.flag = false
    return
  }

  if (message.list[messageIndex.value].list[i].option) {
    optionIndex = i + 1
    autoPlaySetting.option.push(message.list[messageIndex.value].list[i])
    if (
      message.list[messageIndex.value].list?.[optionIndex] &&
      message.list[messageIndex.value].list[optionIndex].option
    ) {
      autoPlay(optionIndex, true)
    }
    return
  }
  autoPlayIndex = i

  if (
    message.list[messageIndex.value].list[i].key === '开拓者' ||
    message.list[messageIndex.value].list[i].notice
  ) {
    loading = false
    autoPlaySetting.list.push(message.list[messageIndex.value].list[i])
  } else {
    if (loading) {
      autoPlaySetting.list.push({
        ...message.list[messageIndex.value].list[i],
        loading: true
      })
    } else {
      autoPlaySetting.list[autoPlaySetting.list.length - 1].loading = false
    }
  }

  nextTick(() => {
    scrollToBottom(boxRef.value?.listDom)

    if (loading) {
      const time = Math.min(
        Math.max(message.list[messageIndex.value].list[i].text.length * 50, 1000),
        2000
      )

      setTimeout(() => {
        autoPlay(i, false)
      }, time)
    } else {
      if (message.list[messageIndex.value].list[i + 1]) {
        const time = message.list[messageIndex.value].list[i + 1].key === '开拓者' ? 1500 : 1000
        setTimeout(() => {
          autoPlay(i + 1, true)
        }, time)
      } else {
        autoPlaySetting.flag = false
      }
    }
  })
}

emitter.on('stopplay', () => stopPlay())

// 取消播放
const stopPlay = () => {
  autoPlaySetting.flag = false
  const list: (Message & { default?: [boolean] })[] = []
  for (let j = autoPlayIndex + 1; j < message.list[messageIndex.value].list.length; j++) {
    if (message.list[messageIndex.value].list[j].option) {
      if (!list[list.length - 1] || !list[list.length - 1].default) {
        list.push({
          ...message.list[messageIndex.value].list[j],
          default: [!!message.list[messageIndex.value].list[j].option?.[0]],
          option: undefined
        })
      } else {
        if (
          !list[list.length - 1].default?.[0] &&
          message.list[messageIndex.value].list[j].option?.[0]
        ) {
          list[list.length - 1].text = message.list[messageIndex.value].list[j].text
          list[list.length - 1].default = [!!message.list[messageIndex.value].list[j].option?.[0]]
        }
      }
    } else {
      list.push(message.list[messageIndex.value].list[j])
    }
  }
  autoPlaySetting.list = [...autoPlaySetting.list, ...list]
  scrollToBottom(boxRef.value?.listDom)
}

emitter.on('screenshot', () => {
  if (setting.preview) return
  reset()

  setting.preview = true
  setting.loading = true
  nextTick(() => {
    if (boxRef.value?.boxDom && boxRef.value?.listDom && setting.preview) {
      domtoimage(boxRef.value.boxDom, undefined, boxRef.value.listDom.scrollHeight + 185)
    }
    setting.loading = false
  })
})

const isGreenScreen = ref(false)
</script>

<style lang="stylus" scoped>
@import './Message/Message.styl'

.bg
  z-index 9
  position absolute
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.6)

.message-preview
  z-index 10
  position absolute
  top 10%
  left 900px
  width 1400px
  height 79%
  message()

  :deep(div)
    cursor auto !important

  :deep(img)
    cursor auto !important

  .notice:hover, .message:hover
    background unset !important

  .close
    z-index 9
    position absolute
    right 70px
    top 65px
    display flex
    justify-content center
    align-items center
    width 100px
    height 100px

    svg
      transition all 0.2s

    &:hover
      svg
        width 80px
        height 80px

  .option-box
    height 90px * 3 + 20px * 4
    border-top var(--menu-border-hover)
    background var(--message-menu-background-color)
    padding 10px 50px
    overflow-y auto
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
      user-select none
      cursor pointer !important

.green
  position absolute
  right 115px
  top 80px
  user-select none
  background rgba(255, 255, 255, 0.5)
  border-radius 5px
  width 50px
  height 50px
  display flex
  justify-content center
  align-items center
  margin-right 20px
  cursor pointer

  &:hover
    background rgba(255, 255, 255, 0.8)
    box-shadow var(--meni-icon-shadow)

.option-enter-active
  transition all 0.25s

.option-leave-active
  transition all 0.15s

.option-enter-from
  height 0 !important

.option-leave-to
  opacity 0
</style>
