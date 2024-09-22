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
      @click.stop=";[emoticonClose(), popupManager.open('avatar')]"
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
import { popupManager } from '@/assets/scripts/popup'
import { emoticonClose } from '@/components/Message/Emoticon'

const handleNameClick = async () => {
  emoticonClose()
  const name = await popupManager.open('input', {
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
  position absolute
  top 50px
  right 105px
  display flex
  align-items center
  color #ddd
  font-size 50px

  .text-wrapper
    overflow hidden

  .text
    box-sizing border-box
    min-width 100px
    max-width 1000px
    height 85px
    text-align center
    text-overflow ellipsis
    white-space nowrap
    cursor pointer

    &:hover
      color var(--menu-btn-hover)

  .avatar
    overflow hidden
    box-sizing border-box
    margin-left 20px
    width 110px
    height 110px
    border-radius 50%
    background rgba(255, 255, 255, 0.1)
    cursor pointer
    user-select none

    &:hover
      box-shadow 0 0 0px 5px rgba(255, 255, 255, 0.3)

    img
      width 100%
      height 100%
      border-radius 50%
      background var(--avatar-background)
      pointer-events none
      user-select none
      object-fit contain
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

  .change
    display flex
    justify-content center
    align-items center
    margin-right 20px
    width 50px
    height 50px
    border-radius 5px
    background rgba(255, 255, 255, 0.2)
    cursor pointer
    user-select none

    &:hover
      background rgba(255, 255, 255, 0.8)
      box-shadow var(--meni-icon-shadow)
</style>
