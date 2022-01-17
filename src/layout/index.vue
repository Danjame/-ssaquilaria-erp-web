<template>
  <el-container>
    <el-aside width="200px"><AppAside /></el-aside>
    <el-container>
      <el-header><AppHeader /></el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'

</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
}

.el-aside {
  position: sticky;
  top: 0;
  color: #333;
  max-height: 100vh;
}

.el-main {
  min-width: 800px;
  color: #333;
}

</style>
