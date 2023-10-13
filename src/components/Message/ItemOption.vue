<template>
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
      @keydown.enter.prevent.stop="blur"
      @keydown.escape.prevent.stop="blur"
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
</template>

<script lang="ts" setup>
import Icon from '../Common/Icon.vue'

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

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
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

  .change, .del
    display flex
    align-items center
    justify-content center
    position absolute
    top 50%
    width 60px
    height 60px
    transform translateY(-50%)
    opacity 0
    transition opacity 0.2s
    cursor pointer

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
