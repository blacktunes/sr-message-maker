<template>
  <Transition
    :name="!state.drag ? 'fade-in' : undefined"
    appear
  >
    <div class="option">
      <div
        @click="emit('select')"
        class="change"
      >
        <Icon
          v-if="!highlight"
          name="success"
          width="50"
          height="50"
        />
        <Icon
          v-else
          name="fail"
          width="50"
          height="50"
        />
      </div>
      <input
        :value="text"
        :style="{
          background: highlight ? 'var(--option-background-hover-color)' : ''
        }"
        @input="emit('update', ($event.target as HTMLInputElement).value)"
        @blur="updateText(($event.target as HTMLInputElement).value)"
        @keydown="onKeydown"
      />
      <div
        @click="emit('delete')"
        class="del"
      >
        <Icon
          name="delete"
          width="35"
          height="35"
        />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { state } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import { onKeydown } from './Message'

defineProps<{
  text: string
  highlight?: boolean
}>()

const emit = defineEmits<{
  (event: 'select'): void
  (event: 'update', text: string): void
  (event: 'delete'): void
}>()

const updateText = (text: string) => {
  if (text.length < 1) emit('update', DEFAULT_TEXT)
}
</script>

<style lang="stylus" scoped>
@import './Message.styl'

.option
  position relative
  display flex
  justify-content center
  align-items center
  padding 15px 0
  item()

  .change
  .del
    position absolute
    top 50%
    display flex
    justify-content center
    align-items center
    width 60px
    height 60px
    opacity 0
    cursor pointer
    transition opacity 0.2s
    transform translateY(-50%)

    :deep(path)
      fill var(--message-item-name-color)

    &:hover
      opacity 1

  .change
    left 20px

  .del
    right 20px

  input
    option()
    width calc(100% - var(--message-item-avatar-width) * 2 - 100px)
</style>
