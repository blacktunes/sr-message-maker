<template>
  <div class="close">
    <div class="line-1"></div>
    <div class="line-2"></div>
    <div class="line-3"></div>
    <div class="line-4"></div>
    <div class="circle"></div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="stylus" scoped>
.close
  position relative
  width 75px
  height 75px
  cursor pointer

  div
    background #131313

  div:nth-child(-n+4)
    position absolute
    width 45%
    height 8%
    transform-origin center
    transition all 0.2s
    border-radius 2px

  .line-1
    top 23%
    left -2%
    transform rotate(45deg) translate(0, -70%)

  .line-2
    top 23%
    right -2%
    transform rotate(-45deg) translate(0, -70%)

  .line-3
    bottom 23%
    left -2%
    transform rotate(-45deg) translate(0, 60%)

  .line-4
    bottom 23%
    right -2%
    transform rotate(45deg) translate(0, 60%)

  .circle
    position absolute
    top 50%
    left 50%
    width 12%
    height 12%
    border-radius 50%
    transform translate(-50%, -50%)
    transition all 0.2s

  &:hover
    div
      background #f19d38

    div:nth-child(-n+4)
      height 10%

    .line-1
      top 20%
      left -5%

    .line-2
      top 20%
      right -5%

    .line-3
      bottom 20%
      left -5%

    .line-4
      bottom 20%
      right -5%

    .circle
      width 18%
      height 18%

  &:active
    div
      background #f19d38

    div:nth-child(-n+4)
      height 8%

    .line-1
      top 33%
      left 8%

    .line-2
      top 33%
      right 8%

    .line-3
      bottom 33%
      left 8%

    .line-4
      bottom 33%
      right 8%

    .circle
      width 5%
      height 5%
</style>
