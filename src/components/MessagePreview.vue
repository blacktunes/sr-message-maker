<template>
  <template v-if="setting.index && setting.preview">
    <Teleport to="body">
      <div
        class="mask"
        v-if="autoPlaySetting.flag"
        @click.stop="handelMaskClick"
      ></div>
    </Teleport>
    <div class="bg"></div>
    <div class="message-preview" @click.stop>
      <div class="box" ref="boxDom">
        <div class="circle">
          <div></div>
        </div>
        <div class="header">
          <div class="title">
            {{ title }}
          </div>
          <div class="info">{{ info }}</div>
          <svg
            class="close"
            width="90"
            height="90"
            viewBox="0 0 250 250"
            xmlns="http://www.w3.org/2000/svg"
            @click.stop="setting.preview = false"
            v-if="false"
          >
            <g>
              <g transform="rotate(45 125 121.154)" id="svg_25">
                <line
                  id="svg_19"
                  y2="120.76915"
                  x2="90.00004"
                  y1="120.76915"
                  x1="-9.99996"
                  stroke-width="15"
                  stroke="#000"
                  fill="none"
                />
                <line
                  id="svg_20"
                  y2="120.76915"
                  x2="259.99996"
                  y1="120.76915"
                  x1="159.99996"
                  stroke-width="15"
                  stroke="#000"
                  fill="none"
                />
                <line
                  id="svg_21"
                  y2="86.1539"
                  x2="125"
                  y1="-13.8461"
                  x1="125"
                  stroke-width="15"
                  stroke="#000"
                  fill="none"
                />
                <line
                  id="svg_22"
                  y2="256.15382"
                  x2="125"
                  y1="156.15382"
                  x1="125"
                  stroke-width="15"
                  stroke="#000"
                  fill="none"
                />
                <ellipse
                  ry="5"
                  rx="5"
                  id="svg_24"
                  cy="121.15386"
                  cx="124.6134"
                  stroke-width="15"
                  stroke="#000"
                  fill="none"
                />
              </g>
            </g>
          </svg>
        </div>
        <div class="message-list" ref="messageListDom">
          <div></div>
          <template v-for="element in dataList" :key="'message' + element.key">
            <div v-if="element.notice" class="notice">
              <img src="@/assets/images/通知.png" alt="" />
              <span>{{ element.text }} </span>
            </div>
            <div
              v-else
              class="message"
              :class="{
                right: element.key === '开拓者',
              }"
            >
              <transition name="avatar" :appear="!setting.preview">
                <div class="avatar">
                  <img :src="element.avatar" alt="" />
                </div>
              </transition>
              <div class="message-item">
                <transition name="message" :appear="!setting.preview">
                  <div class="name">
                    <span>
                      {{
                        element.key === "开拓者" ? setting.name : element.name
                      }}
                    </span>
                  </div>
                </transition>
                <transition name="message" :appear="!setting.preview">
                  <div v-if="element.loading" class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div
                    class="img"
                    v-else-if="element.img"
                    :style="{ width: element.emoticon ? '320px' : '' }"
                  >
                    <img :src="element.img" alt="" />
                  </div>
                  <div class="text" v-else>
                    {{ element.text }}
                  </div>
                </transition>
              </div>
            </div>
          </template>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import domtoimage from '@/assets/scripts/screenshot'
import { message } from '@/store/message'
import { autoPlaySetting, setting } from '@/store/setting'
import { computed, nextTick, ref } from 'vue'
import { scrollToBottom, useMessage } from './Message'

const messageListDom = ref<HTMLElement | null>(null)

const messageIndex = computed(() => {
  if (setting.index) {
    return message.list.findIndex(item => {
      return item.id === setting.index
    })
  } else {
    return -1
  }
})

const { title, info } = useMessage(messageIndex)

// 要显示的数据
const dataList = computed({
  get: () => autoPlaySetting.flag ? autoPlaySetting.list : message.list[messageIndex.value].list,
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
  autoPlay(0, true)
})

const autoPlay = (i: number, loading: boolean) => {
  if (!autoPlaySetting.flag) return

  if (message.list[messageIndex.value].list[i].key === '开拓者' || message.list[messageIndex.value].list[i].notice) {
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
    scrollToBottom(messageListDom)

    if (loading) {
      setTimeout(() => {
        autoPlay(i, false)
      }, 1000)
    } else {
      if (message.list[messageIndex.value].list[i + 1]) {
        setTimeout(() => {
          autoPlay(i + 1, true)
        }, 1000)
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
  scrollToBottom(messageListDom)
}

const boxDom = ref<HTMLElement | null>(null)

emitter.on('screenshot', () => {
  if (setting.preview) return

  setting.preview = true
  nextTick(() => {
    if (boxDom.value && messageListDom.value) {
      domtoimage(boxDom.value, undefined, messageListDom.value.scrollHeight + 185 + 230)
    }
  })
})
</script>

<style lang="stylus" scoped>
@import './Message.styl'

.bg
  z-index 9
  position absolute
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.5)

.message-preview
  z-index 10
  position absolute
  top 60px
  left 900px
  width 1400px
  height 1350px
  message()

  *
    cursor auto !important

  .notice:hover, .message:hover
    background unset !important

  .close
    position absolute
    right 50px
    bottom 25px
    cursor pointer !important

.mask
  z-index 999
  position fixed
  width 100vw
  height 100vh
  cursor pointer

@keyframes circle
  0%
    opacity 0

  33%
    opacity 1

  66%
    opacity 0

  100%
    opacity 0
</style>
