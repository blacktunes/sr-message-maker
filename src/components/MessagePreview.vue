<template>
  <Teleport to="body">
    <div
      class="mask"
      v-if="autoPlaySetting.flag"
      @click.stop="handelMaskClick"
    ></div>
  </Teleport>
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
      :mission="message.list[messageIndex].mission"
      :playing="autoPlaySetting.flag"
      preview
      @click.stop
      ref="boxRef"
    >
      <template #top>
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
      <template
        v-for="(element, index) in dataList"
        :key="`preview-${index}`"
      >
        <MessageItem
          :item="element"
          :index="0"
          preview
        />
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
const dataList = computed({
  get: () => (autoPlaySetting.flag ? autoPlaySetting.list : message.list[messageIndex.value].list),
  set: (val) => {
    if (!autoPlaySetting.flag) {
      message.list[messageIndex.value].list = val
    }
  }
})

emitter.on('autoplay', () => {
  if (autoPlaySetting.flag) return

  setting.preview = true
  autoPlaySetting.list = []
  autoPlaySetting.flag = true
  nextTick(() => {
    autoPlay(0, true)
  })
})

const autoPlay = (i: number, loading: boolean) => {
  if (!autoPlaySetting.flag) return
  if (!message.list[messageIndex.value].list?.[i]) {
    autoPlaySetting.flag = false
    return
  }

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
      autoPlaySetting.list[i].loading = false
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

// 取消播放
const handelMaskClick = () => {
  autoPlaySetting.flag = false
  autoPlaySetting.list = []
  scrollToBottom(boxRef.value?.listDom)
}

emitter.on('screenshot', () => {
  if (setting.preview) return

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
  background rgba(0, 0, 0, 0.5)

.message-preview
  z-index 10
  position absolute
  top 5%
  left 900px
  width 1400px
  height 90%
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

.mask
  z-index 999
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  cursor wait

.green
  position absolute
  right 115px
  top 60px
  background var(--menu-icon-background-color)
  border-radius 50%
  width 90px
  height 90px
  display flex
  justify-content center
  align-items center
  cursor pointer
</style>
