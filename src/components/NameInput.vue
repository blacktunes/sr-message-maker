<template>
  <div class="name">
    <div class="text-wrapper">
      <div
        class="text"
        title="修改昵称"
        @click.stop="handleNameClick"
      >
        {{ setting.name }}
      </div>
    </div>
    <div
      class="avatar"
      @click.stop=";[emoticonClose(), openWindow('avatar')]"
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
import { setName, setting } from '@/store/setting'
import { userData } from '@/store/avatar'
import { openWindow } from '@/assets/scripts/popup'
import { emoticonClose } from '@/components/Message/Emoticon'

const handleNameClick = async () => {
  emoticonClose()
  const name = await openWindow('input', {
    title: '修改昵称',
    tip: '建议不要使用过长的昵称',
    required: false,
    defaultText: setting.name,
    placeholder: '开拓者'
  })
  if (name !== null) {
    setName(name)
  }
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
      background var(--avatar-background)
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
