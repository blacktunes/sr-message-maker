<template>
  <div class="icon">
    <img
      src="@/assets/images/短信.svg"
      alt=""
    />
    <span>短信</span>
  </div>
  <div class="img">
    <img
      src="@/assets/images/背景.png"
      alt=""
    />
  </div>
</template>

<style lang="stylus" scoped>
.icon
  position absolute
  top 45px
  left 185px
  display flex
  align-items center
  user-select none

  span
    margin 0 0 15px 20px
    font-size 46px
    color #ddd

.img
  z-index -1
  overflow hidden
  position absolute
  top 30px
  left 30px
  width 650px
  height 470px
  opacity 0.5
  pointer-events none
  user-select none

  img
    position absolute
    bottom 0
    right 0
    animation rotate 60s linear infinite
</style>
