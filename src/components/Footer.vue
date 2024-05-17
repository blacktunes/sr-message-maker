<template>
  <div class="link">
    <a
      href="https://github.com/blacktunes/sr-message-maker"
      target="_blank"
    >
      Github
    </a>
    <div class="sep"></div>
    <a
      href="https://space.bilibili.com/1384118"
      target="_blank"
    >
      BiliBili
    </a>
    <div class="sep"></div>
    <a
      href="https://light.shenmedouyou.top/"
      target="_blank"
    >
      光锥生成器
    </a>
  </div>
</template>

<style lang="stylus" scoped>
.link
  position absolute
  bottom -80px
  display flex
  justify-content center
  align-items center
  width 100%
  height 75px
  color #ddd

  .sep
    margin 0 25px
    width 10px
    height 10px
    border-radius 50%
    background-color #666

  a
    color #ddd
    text-decoration none
    font-size 50px
    opacity 0.25
    user-select none

    &:hover
      opacity 9
</style>
