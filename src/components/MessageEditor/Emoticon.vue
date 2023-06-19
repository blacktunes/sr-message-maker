<template>
  <div class="emoticon" v-show="input.emoticon" @click.stop="">
    <div
      class="item"
      v-for="(item, index) in emoticon"
      @click="handelEmoticonClick(item.url, item.title)"
      :title="item.title"
      :key="index"
    >
      <img :src="item.url" :alt="item.title" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emoticon } from '@/assets/scripts/gameData'
import { input } from '@/store/input'

const emit = defineEmits<{(event: 'emoticon', url: string, name: string): void }>()

const handelEmoticonClick = (url: string, name: string) => {
  emit('emoticon', url, name)
}
</script>

<style lang="stylus" scoped>
.emoticon
  overflow auto
  position absolute
  right 50px
  bottom 180px
  width 1200px
  height 650px
  padding 50px
  background #fff
  display flex
  flex-wrap wrap
  background-color #fff
  border-radius 5px
  box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.15)

  .item
    width 20%
    cursor pointer

    img
      width 100%
</style>
