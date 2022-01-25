<template>
  <el-space size="large">
    <AppCollapse />
    <AppBreadcrumb :routes="routes" />
  </el-space>
  <el-space size="large">
    <AppFullScreen />
    <AppNotification />
    <AppUser />
  </el-space>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import AppCollapse from './AppCollapse.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppFullScreen from './AppFullScreen.vue'
import AppNotification from './AppNotification.vue'
import AppUser from './AppUser.vue'
import router from '@/router/index'

const routes = computed(() => {
  return router.currentRoute.value.matched.filter(item => item.meta.title)
})

</script>

<style lang="scss" scoped>

</style>
