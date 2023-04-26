<template>
  <div class="name-wrapper">
    <span>ID:</span>
    <div class="name" contenteditable @input="updateName($event)">
      {{ setting.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'

const updateName = (e: Event) => {
  setting.name = (e.target as HTMLInputElement).innerText
  localStorage.setItem('sr-message-name', setting.name)
}
</script>

<style lang="stylus" scoped>
.name-wrapper
  display flex
  position absolute
  right 190px
  top 50px
  color #ddd
  font-size 50px

  .name
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    max-width 500px
</style>
