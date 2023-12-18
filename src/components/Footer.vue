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

  .sep
    width 10px
    height 10px
    background-color #666
    border-radius 50%
    margin 0 25px

  a
    color #ddd
    font-size 50px
    user-select none
    text-decoration none
    opacity 0.25

    &:hover
      opacity 1
</style>
