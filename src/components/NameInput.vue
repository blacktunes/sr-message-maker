<template>
  <div class="name">
    <div
      class="change"
      title="更换主角"
      @click="handelChangeClick"
    >
      <Icon name="change" />
    </div>
    <div class="text-wrapper">
      <div
        class="text"
        contenteditable
        @keydown.enter.prevent="updateName($event)"
        @blur="updateName($event)"
        title="修改角色名"
      >
        {{ setting.name }}
      </div>
    </div>
    <div
      class="avatar"
      @click="handelAvatarClick"
      title="修改头像"
    >
      <img
        :src="user[setting.type].avatar || ''"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { user } from '@/assets/data/characterData'
import { setUserType, setting } from '@/store/setting'
import Icon from './Common/Icon.vue'
import { compressImage } from '@/assets/scripts/image'
import { cropperOpen } from '@/store/cropper'

const updateName = (e: Event) => {
  setting.name = (e.target as HTMLInputElement).innerText
  if (setting.name === '') setting.name = '开拓者'
  localStorage.setItem('sr-message-name', setting.name)
}

const handelAvatarClick = async () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = async () => {
    if (el.files?.[0]) {
      const avatar = await compressImage(el.files[0])
      cropperOpen(
        avatar,
        (res) => {
          user.custom.avatar = res
          user.custom.card = res
          localStorage.setItem('sr-message-avatar', res)
          setUserType('custom')
        },
        {
          aspectRatio: 1,
          maxWidth: 500
        }
      )
    }
  }
  el.click()
}

const handelChangeClick = () => {
  switch (setting.type) {
    case '星':
      setting.type = '穹'
      break
    case '穹':
      if (user.custom.avatar) {
        setting.type = 'custom'
      } else {
        setting.type = '星'
      }
      break
    default:
      setting.type = '星'
  }
  localStorage.setItem('sr-message-type', setting.type)
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
    max-width 500px

  .text
    box-sizing border-box
    white-space nowrap
    text-overflow ellipsis
    height 85px

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
