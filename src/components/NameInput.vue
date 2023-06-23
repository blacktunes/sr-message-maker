<template>
  <div class="name">
    <div class="change" title="更换主角" @click="handelChangeClick">
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
      >
        <path
          d="M768 426.666667a42.666667 42.666667 0 0 0-42.666667-42.666667H230.826667l98.133333-97.706667a42.666667 42.666667 0 0 0-60.586667-60.586666l-170.666666 170.666666a42.666667 42.666667 0 0 0-8.96 46.506667A42.666667 42.666667 0 0 0 128 469.333333h597.333333a42.666667 42.666667 0 0 0 42.666667-42.666666z m167.253333 154.453333A42.666667 42.666667 0 0 0 896 554.666667H298.666667a42.666667 42.666667 0 0 0 0 85.333333h494.506666l-98.133333 97.706667a42.666667 42.666667 0 0 0 0 60.586666 42.666667 42.666667 0 0 0 60.586667 0l170.666666-170.666666a42.666667 42.666667 0 0 0 8.96-46.506667z"
        ></path>
      </svg>
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
    <div class="avatar" @click="handelAvatarClick">
      <img :src="user[setting.type].avatar || ''" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { user } from '@/assets/scripts/gameData'
import { setUserType, setting } from '@/store/setting'

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
    background #e3e3e3
    border-radius 50%
    width 50px
    height 50px
    display flex
    justify-content center
    align-items center
    margin-right 20px
    cursor pointer
</style>
