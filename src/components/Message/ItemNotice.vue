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
  height 60px
  margin-top 60px
  padding 20px 0 20px 0
  font-size 30px
  color var(--notice-color)

  img
    user-select none

  span
    max-width 80%
    margin-left 20px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis

  div
    position relative
    height 100%

    .del
      display flex
      align-items center
      justify-content center
      position absolute
      right -100px
      width 60px
      height 60px
      opacity 0
      cursor pointer

      :deep(path)
        fill var(--notice-color)

      &:hover
        opacity 1
</style>
