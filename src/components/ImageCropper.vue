<template>
  <Transition name="fade">
    <div
      class="cropper"
      v-if="cropperSetting.show"
      @click.stop
    >
      <VuePictureCropper
        :img="cropperSetting.img"
        :options="{
          viewMode: 1,
          movable: false,
          scalable: false,
          zoomOnWheel: false,
          autoCrop: cropperSetting.aspectRatio !== undefined,
          autoCropArea: 1,
          aspectRatio: cropperSetting.aspectRatio
        }"
      />
      <div
        class="btn-list"
        :style="{
          transform: `scale(${scale}) translateX(-50%)`
        }"
      >
        <Btn
          class="btn"
          name="取消"
          type="wrong"
          @click.stop="cropperClose"
        />
        <Btn
          class="btn"
          name="确认"
          type="check"
          @click.stop="onCropper"
        />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import Btn from '@/components/Common/Btn.vue'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { cropper as cropperSetting, cropperClose } from '@/store/cropper'

defineProps<{
  scale: number
}>()

const onCropper = () => {
  if (cropperSetting.fn) {
    cropperSetting.fn(
      cropper?.getDataURL({ maxWidth: cropperSetting.maxWidth }) || cropperSetting.img
    )
  }
  cropperClose()
}
</script>

<style lang="stylus" scoped>
.cropper
  position fixed
  top 0
  right 0
  bottom 0
  left 0

.btn-list
  display flex
  position fixed
  bottom 15px
  left 50%
  width auto
  transform-origin 0 bottom 0px

  .btn
    width 600px
    height 100px
</style>
