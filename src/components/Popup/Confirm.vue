<template>
  <transition name="fade">
    <window
      confirm
      :title="confirmData.title"
      width="50%"
      v-if="popup.confirm"
    >
      <div class="text">
        <div
          v-for="(text, index) in confirmData.text"
          :key="index"
          v-html="text"
        ></div>
      </div>
      <template #footer>
        <Btn
          v-if="!confirmData.fn"
          class="btn"
          name="知道了"
          @click="onCancelClick"
        />
        <template v-else>
          <Btn
            class="btn"
            name="取消"
            type="wrong"
            @click="onCancelClick"
          />
          <Btn
            class="btn"
            name="确认"
            type="check"
            @click="onConfirmlClick"
          />
        </template>
      </template>
    </window>
  </transition>
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import { confirmData, popup } from '@/store/popup'
import Btn from '@/components/Common/Btn.vue'

const reset = () => {
  confirmData.title = ''
  confirmData.text = []
  confirmData.fn = undefined
}

const onCancelClick = () => {
  popup.confirm = false
  reset()
}

const onConfirmlClick = () => {
  popup.confirm = false
  confirmData.fn?.()
  reset()
}
</script>

<style lang="stylus" scoped>
.text
  text-align center
  font-size 50px
  margin 50px auto 80px auto

.btn
  width 650px
</style>
