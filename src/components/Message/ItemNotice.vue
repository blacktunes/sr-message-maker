<template>
  <div class="notice">
    <Icon name="warn" />
    <span
      :contenteditable="!preview"
      @keydown.enter.prevent.stop="preview ? undefined : blur($event)"
      @keydown.escape.prevent.stop="preview ? undefined : blur($event)"
      @blur="preview ? undefined : updateMessage($event)"
    >
      {{ text }}
    </span>
    <div v-if="!preview">
      <div
        @click="emit('delete')"
        class="del"
      >
        <Icon
          name="delete"
          width="30"
          height="30"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '../Common/Icon.vue'

defineProps<{
  text: string
  preview?: boolean
}>()

const emit = defineEmits<{
  (event: 'update', text: string): void
  (event: 'delete'): void
}>()

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
}

const updateMessage = (e: Event) => {
  if (e.target) {
    let text = (e.target as HTMLElement).innerText
    if (text.length < 1) {
      text = DEFAULT_TEXT
      ;(e.target as HTMLElement).innerText = DEFAULT_TEXT
    }
    emit('update', text)
  }
}
</script>

<style lang="stylus" scoped>
@import './Message.styl'

.notice
  display flex
  justify-content center
  align-items center
  item()
  margin-top 60px
  padding 20px 0
  height 60px
  color var(--notice-color)
  font-size 30px

  img
    user-select none

  span
    overflow hidden
    margin-left 20px
    max-width 80%
    text-overflow ellipsis
    white-space nowrap

  div
    position relative
    height 100%

    .del
      position absolute
      right -100px
      display flex
      justify-content center
      align-items center
      width 60px
      height 60px
      opacity 0
      cursor pointer

      :deep(path)
        fill var(--notice-color)

      &:hover
        opacity 1
</style>
