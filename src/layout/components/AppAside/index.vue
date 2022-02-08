<template>
  <AppLogo />
  <AppMenu :menus="menus" :route="route" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import AppLogo from './AppLogo.vue'
import AppMenu from './AppMenu.vue'
import { Menu } from '@/api/system/types/menu'
import router from '@/router'
import { getCurrentUser } from '@/api/system/user'
import store from '@/store'

const menus = ref<Menu[]>([])
const route = router.currentRoute.value.path

onMounted(async () => {
  const { menuTrees } = await getCurrentUser()
  menus.value = menuTrees
  store.commit('setMenus', menuTrees)
})

</script>

<style lang="scss" scoped>

</style>
