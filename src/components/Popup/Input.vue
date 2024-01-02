<template>
  <window
    :show="popup.input"
    style="z-index: 990"
    confirm
    :title="inputData.title"
    width="55%"
  >
    <div class="text">
      <input
        type="text"
        ref="inputDom"
        v-model="inputData.text"
        :placeholder="inputData.placeholder"
        @keydown.enter.prevent.stop="onConfirmlClick"
      />
    </div>
    <template
      #bottom
      v-if="inputData.tip"
    >
      <div class="tip">{{ inputData.tip }}</div>
    </template>
    <template #footer>
      <Btn
        class="win-btn"
        name="取消"
        type="wrong"
        @click="popup.input = false"
      />
      <Btn
        class="win-btn"
        name="确认"
        :disable="inputData.required && (!inputData.fn || inputData.text.length < 1)"
        type="check"
        @click="onConfirmlClick"
      />
    </template>
  </window>
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import { inputData, popup, popupCallbalk } from '@/store/popup'
import Btn from '@/components/Common/Btn.vue'
import { ref, nextTick, watch } from 'vue'

const inputDom = ref<HTMLInputElement | null>(null)

watch(
  () => popup.input,
  () => {
    if (popup.input) {
      nextTick(() => {
        inputDom.value?.focus()
      })
    } else {
      if (inputData.fn) {
        inputData.fn('')
        reset()
      }
    }
  }
)

const reset = () => {
  inputData.title = ''
  inputData.tip = undefined
  inputData.required = true
  inputData.text = ''
  inputData.placeholder = undefined
  inputData.fn = undefined
}

const onConfirmlClick = () => {
  if (inputData.required && inputData.text.length < 1) return false

  inputData.fn?.(inputData.text)
  reset()
  popup.input = false
  return true
}

popupCallbalk.input = onConfirmlClick
</script>

<style lang="stylus" scoped>
.text
  flex 1
  display flex
  justify-content center
  align-items center
  margin 80px 110px

  input
    box-sizing border-box
    flex 1
    font-size 50px
    height 90px
    padding 5px 60px
    background #c7c7c7
    border 2px solid #666
    border-radius 45px
    outline none

.tip
  text-align center
  background #b4b4b4
  padding 10px
</style>
