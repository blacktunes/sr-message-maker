<template>
  <Window
    :show="popup.message"
    title="消息管理"
    @close="popup.message = false"
  >
    <div class="config">
      <table class="table">
        <tr
          class="line"
          v-if="message.list[messageIndex].list?.[messageData.key || -1]?.key !== '开拓者'"
        >
          <td class="left">修改昵称</td>
          <td class="right">
            <div
              class="link"
              @click.stop="handelChangeName"
            >
              <span>点击修改</span>
              <Icon
                name="arrow"
                class="icon"
              />
            </div>
          </td>
        </tr>
        <tr class="line">
          <td class="left">等待时间</td>
          <td class="right">
            <div class="slider">
              <Slider
                class="range"
                :min="1"
                :max="5"
                :step="0.1"
                v-model="interval"
              />
              <span class="text">
                {{ interval ? interval + '秒' : '默认' }}
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <template #footer>
      <Btn
        class="win-btn"
        name="取消"
        type="wrong"
        @click="popup.message = false"
      />
      <Btn
        class="win-btn"
        name="确认"
        type="check"
        @click="onConfirml"
      />
    </template>
  </Window>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { message } from '@/store/message'
import { messageData, popup, showInput } from '@/store/popup'
import { messageIndex } from '../Message/Message'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import Slider from '../Common/Slider.vue'
import Icon from '../Common/Icon.vue'

// 修改昵称
const handelChangeName = async () => {
  if (messageData.key !== undefined && message.list[messageIndex.value].list[messageData.key]) {
    if (message.list[messageIndex.value].list[messageData.key].key !== '开拓者') {
      const name: string = await showInput({
        title: '修改昵称',
        tip: '建议不要使用过长的昵称',
        required: false,
        defaultText: message.list[messageIndex.value].list[messageData.key].name,
        placeholder: message.list[messageIndex.value].list[messageData.key].name
      })
      if (name.length > 0) {
        message.list[messageIndex.value].list[messageData.key].name = name
      }
    }
  }
}

// 等待时间
watch(
  () => popup.message,
  () => {
    if (popup.message) {
      if (messageData.key !== undefined) {
        interval.value =
          (message.list[messageIndex.value].list?.[messageData.key].interval || 0) / 1000
      }
    } else {
      messageData.key = undefined
    }
  }
)
const interval = ref(0)

const onConfirml = () => {
  if (
    interval.value > 0 &&
    messageData.key !== undefined &&
    message.list[messageIndex.value].list[messageData.key]
  ) {
    message.list[messageIndex.value].list[messageData.key].interval = interval.value * 1000
  }
  popup.message = false
}
</script>

<style lang="stylus" scoped>
.config
  width 1600px
  padding 60px 0
  user-select none

  .table
    width 100%
    border-collapse collapse

    .line
      height 120px
      border 1px solid #000

      .left, .right
        box-sizing border-box
        padding 5px 40px

      .left
        width 60%
        background transparent

      .right
        width 40%
        background #e2e2e2

  .slider
    display flex
    justify-content space-evenly
    align-items center

    .range
      flex 0 0 70%
      margin 20px 0

    .text
      flex 0 0 20%
      text-align right

  .link
    position relative
    display flex
    justify-content center
    align-items center
    cursor pointer

    .icon
      position absolute
      right 0

  .link_disable
    color #808080
    cursor not-allowed

    .icon
      display none
</style>
