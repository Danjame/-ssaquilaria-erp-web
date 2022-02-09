<template>
  <el-space size="large">
    <AppCollapse />
    <AppBreadcrumb />
  </el-space>
  <el-space size="large">
    <AppFullScreen />
    <AppNotification />
    <AppUser />
  </el-space>
</template>

<script lang="ts" setup>
import AppCollapse from './AppCollapse.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppFullScreen from './AppFullScreen.vue'
import AppNotification from './AppNotification.vue'
import AppUser from './AppUser.vue'

</script>

<style lang="scss" scoped>
</style>
