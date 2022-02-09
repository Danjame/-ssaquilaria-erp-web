<template>
  <el-icon :size="20" @click="toggleFullScreen">
    <component :is="'FullScreen'" />
  </el-icon>
</template>

<script lang="ts" setup>
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

</script>
