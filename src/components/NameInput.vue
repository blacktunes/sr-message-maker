<template>
  <div class="name">
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
    <div class="change" title="更换男女主" @click="handelChangeClick">
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
  </div>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'

const updateName = (e: Event) => {
  setting.name = (e.target as HTMLInputElement).innerText
  if (setting.name === '') setting.name = '开拓者'
  localStorage.setItem('sr-message-name', setting.name)
}

const handelChangeClick = () => {
  if (setting.type === '星') {
    setting.type = '穹'
  } else {
    setting.type = '星'
  }
  localStorage.setItem('sr-message-type', setting.type)
}
</script>

<style lang="stylus" scoped>
.name
  display flex
  position absolute
  right 125px
  top 50px
  color #ddd
  font-size 50px

  .text
    box-sizing border-box
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    max-width 500px

  .change
    background #e3e3e3
    border-radius 50%
    width 70px
    height 70px
    display flex
    justify-content center
    align-items center
    margin-left 10px
    cursor pointer
</style>
