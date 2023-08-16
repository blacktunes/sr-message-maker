<template>
  <div class="link">
    <a
      href="https://github.com/blacktunes/sr-message-maker"
      target="_blank"
    >
      Github
    </a>
    <span>·</span>
    <a
      href="https://space.bilibili.com/1384118"
      target="_blank"
    >
      BiliBili
    </a>
    <div
      class="font-btn"
      title="修改字体"
      @click.stop="popup.font = !popup.font"
      v-show="!setting.preview"
    >
      <Icon name="font" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'
import { popup } from '@/store/popup'
import Icon from '@/components/Common/Icon.vue'
</script>

<style lang="stylus" scoped>
.link
  position absolute
  bottom -80px
  display flex
  width 100%
  justify-content center

  a, span
    color #666
    font-size 50px
    user-select none

  a
    text-decoration none

  span
    margin 0 20px

.font-btn
  position absolute
  right 5px
  cursor pointer
  opacity 0.5

  &:hover
    opacity 0.9
</style>
