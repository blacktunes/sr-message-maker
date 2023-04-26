<template>
  <div class="charater-wrapper" @click="hide" v-show="input.select">
    <div class="charater-list" @click.stop="">
      <div
        class="charater"
        v-for="(item, key) in avatar"
        :key="`avatar-${key}`"
        @click="handelCharaterClick(String(key))"
      >
        <img
          :src="item"
          :alt="String(key)"
          :title="String(key)"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { avatar } from '@/assets/scripts/avatar'
import { input } from '@/store/input'
import { message } from '@/store/message'

const hide = () => {
  input.select = false
}

const handelCharaterClick = (key: string) => {
  if (input.index) {
    message.list[input.index[0]].list[input.index[1]].key = key
    message.list[input.index[0]].list[input.index[1]].name = key
    input.index = undefined
  } else {
    input.character = key
  }
  hide()
}
</script>

<style lang="stylus" scoped>
.charater-wrapper
  display flex
  justify-content center
  align-items center
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.3)
  user-select none

  .charater-list
    display flex
    flex-wrap wrap
    width 90%
    height 80%
    background #d5d5d5
    box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
    cursor default

    .charater
      width 360px
      height 360px
      cursor pointer

      img
        width 100%
</style>
