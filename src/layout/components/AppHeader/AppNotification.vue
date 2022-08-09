<template>
  <el-icon :size="20" @click="openMessage">
    <component :is="'Bell'" />
  </el-icon>
</template>

<script lang="ts" setup>
const openMessage = () => {
  ElMessage.info('暂无消息')
}
</script>
