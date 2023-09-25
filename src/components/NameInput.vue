<template>
  <div class="name">
    <div class="text-wrapper">
      <div
        class="text"
        title="修改昵称"
        @click.stop="handelNameClick"
      >
        {{ setting.name }}
      </div>
    </div>
    <div
      class="avatar"
      @click.stop="openWindow('avatar')"
      title="修改头像"
    >
      <img
        :src="userData.avatar"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'
import { userData } from '@/store/character'
import { openWindow, showInput } from '@/store/popup'

const handelNameClick = async () => {
  const name: string = await showInput('修改昵称', '建议不要使用过长的昵称', false, setting.name, '开拓者')
  if (name.length < 1) {
    setting.name = '开拓者'
  } else {
    setting.name = name
  }
  localStorage.setItem('sr-message-name', setting.name)
}
</script>

<style lang="stylus" scoped>
.name
  display flex
  align-items center
  position absolute
  right 105px
  top 50px
  color #ddd
  font-size 50px

  .text-wrapper
    overflow hidden

  .text
    box-sizing border-box
    white-space nowrap
    text-overflow ellipsis
    text-align center
    min-width 100px
    max-width 1000px
    height 85px
    cursor pointer

    &:hover
      color var(--menu-btn-hover)

  .avatar
    user-select none
    box-sizing border-box
    overflow hidden
    border-radius 50%
    width 110px
    height 110px
    margin-left 20px
    background rgba(255, 255, 255, 0.1)
    cursor pointer

    &:hover
      box-shadow 0 0 0px 5px rgba(255, 255, 255, 0.3)

    img
      width 100%
      height 100%
      object-fit contain
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
      user-select none
      pointer-events none

  .change
    user-select none
    background rgba(255, 255, 255, 0.2)
    border-radius 5px
    width 50px
    height 50px
    display flex
    justify-content center
    align-items center
    margin-right 20px
    cursor pointer

    &:hover
      background rgba(255, 255, 255, 0.8)
      box-shadow var(--meni-icon-shadow)
</style>
