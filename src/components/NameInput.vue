<template>
  <div class="name">
    <div class="change" title="更换主角" @click="handelChangeClick">
      <Icon name="change" />
    </div>
    <div
      class="text"
      v-once
      contenteditable
      @keydown.enter.prevent
      @input="updateName($event)"
      title="修改角色名"
    >
      {{ setting.name }}
    </div>
    <div class="avatar" @click="handelAvatarClick" title="修改头像">
      <img :src="user[setting.type].avatar || ''" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { user } from '@/assets/data/characterData'
import { setUserType, setting } from '@/store/setting'
import Icon from './Common/Icon.vue'

const updateName = (e: Event) => {
  setting.name = (e.target as HTMLInputElement).innerText
  if (setting.name === '') setting.name = '开拓者'
  localStorage.setItem('sr-message-name', setting.name)
}

const handelAvatarClick = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = e => {
        const avatar = e.target?.result as string
        user.custom.avatar = avatar
        user.custom.card = avatar
        localStorage.setItem('sr-message-avatar', avatar)
        setUserType('custom')
      }
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

  .text
    box-sizing border-box
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    max-width 500px
    line-height 70px

    &:hover
      color var(--menu-btn-hover)

  .avatar
    user-select none
    box-sizing border-box
    border 5px solid #3a3a3a
    overflow hidden
    border-radius 50%
    width 110px
    height 110px
    margin-left 20px
    background #3a3a3a
    cursor pointer

    img
      width 100%

  .change
    user-select none
    background var(--menu-icon-background-color)
    border-radius 50%
    width 50px
    height 50px
    display flex
    justify-content center
    align-items center
    margin-right 20px
    cursor pointer
</style>
