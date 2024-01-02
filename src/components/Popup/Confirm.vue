<template>
  <window
    style="z-index: 999"
    confirm
    :title="confirmData.title"
    :show="popup.confirm"
    min-width="50%"
  >
    <div class="text">
      <div
        v-for="(text, index) in confirmData.text"
        :key="index"
        v-html="text"
      ></div>
    </div>
    <template
      #bottom
      v-if="confirmData.tip"
    >
      <div class="tip">{{ confirmData.tip }}</div>
    </template>
    <template #footer>
      <Btn
        v-if="!confirmData.fn"
        class="win-btn"
        name="知道了"
        @click="popup.confirm = false"
      />
      <template v-else>
        <Btn
          class="win-btn"
          name="取消"
          type="wrong"
          @click="popup.confirm = false"
        />
        <Btn
          class="win-btn"
          name="确认"
          type="check"
          @click="onConfirml"
        />
      </template>
    </template>
  </window>
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import { confirmData, popup, popupCallbalk } from '@/store/popup'
import Btn from '@/components/Common/Btn.vue'
import { watch } from 'vue'

watch(
  () => popup.confirm,
  () => {
    if (!popup.confirm) {
      reset()
    }
  }
)

const reset = () => {
  confirmData.title = ''
  confirmData.tip = undefined
  confirmData.text = []
  confirmData.fn = undefined
}

const onConfirml = () => {
  confirmData.fn?.()
  popup.confirm = false
  return true
}

popupCallbalk.confirm = onConfirml
</script>

<style lang="stylus" scoped>
.text
  text-align center
  font-size 50px
  margin 100px 300px

.tip
  text-align center
  background #e4c680
  padding 10px
</style>
