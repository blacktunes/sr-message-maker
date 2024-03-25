<template>
  <Popup :index="props.index">
    <window
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
          @click="close"
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
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import { inputData } from './'
import { enterCallback } from '@/assets/scripts/popup'

const inputDom = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}

watch(
  () => props.index,
  () => {
    if (props.index !== -1) {
      nextTick(() => {
        inputDom.value?.focus()
      })
    }
  }
)

const onConfirmlClick = () => {
  if (inputData.required && inputData.text.length < 1) return false

  inputData.fn?.(inputData.text || inputData.placeholder || '')
  close()
  return true
}

enterCallback[props.name] = onConfirmlClick
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
