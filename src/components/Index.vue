<template>
  <div
    class="drop-view"
    @dragenter.prevent
    @dragover.prevent
    @drop.prevent.stop="handleDrop"
  >
    <Menu />
    <Editor />
  </div>
</template>

<script lang="ts" setup>
import { uploadFile } from '@/assets/scripts/upload'
import Editor from './Index/Editor.vue'
import Menu from './Index/Menu.vue'

const handleDrop = (e: DragEvent) => {
  if (e?.dataTransfer?.files) {
    uploadFile(e.dataTransfer.files[0], true)
  }
}
</script>

<style lang="stylus" scoped>
.drop-view
  position absolute
  inset 0
</style>
