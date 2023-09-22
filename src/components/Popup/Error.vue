<template>
  <transition name="fade">
    <window
      :title="errorData.title"
      width="50%"
      v-if="popup.error"
    >
      <div class="text">
        <div
          v-for="(text, index) in errorData.text"
          :key="index"
          v-html="text"
        ></div>
      </div>
      <template #footer>
        <Btn
          style="width: 650px"
          name="知道了"
          @click="popup.error = false"
        />
      </template>
    </window>
  </transition>
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import { errorData, popup } from '@/store/popup'
import Btn from '@/components/Common/Btn.vue'
</script>

<style lang="stylus" scoped>
.text
  text-align center
  font-size 50px
  margin 50px auto 80px auto
</style>
