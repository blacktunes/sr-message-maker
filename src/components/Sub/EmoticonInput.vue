<template>
  <div class="emoticon-wrapper" data-emoticon="1" v-show="input.emoticon">
    <div
      class="emoticon"
      v-for="(item, index) in emoticon"
      @click="handelEmoticonClick(item.url, item.title)"
      :title="item.title"
      :key="index"
      data-emoticon="1"
    >
      <img :src="item.url" :alt="item.title" data-emoticon="1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emoticon } from '@/assets/scripts/gameData'
import { input } from '@/store/input'

const emit = defineEmits<{(event: 'emoticon', url: string, name: string): void }>()

document.addEventListener('click', e => {
  if (input.emoticon) {
    if (!(e.target as HTMLElement).dataset.emoticon) {
      input.emoticon = false
    }
  }
})

const handelEmoticonClick = (url: string, name: string) => {
  emit('emoticon', url, name)
}
</script>

<style lang="stylus" scoped>
.emoticon-wrapper
  overflow auto
  position absolute
  right 60px
  bottom 180px
  width 1200px
  height 650px
  padding 50px
  background #fff
  display flex
  flex-wrap wrap
  background-color #fff
  border-radius 5px
  box-shadow 0 0 20px 5px rgba(0,0,0,0.15)

  .emoticon
    width 20%
    cursor pointer

    img
      width 100%
</style>
