<template>
  <div class="aside-header">
    <!-- <el-image style="width: 50px; height: 50px" :src="logoSrc" fit="fill" /> -->
    <div class="aside-header-title">
      <span>中科沉香ERP系统</span>
    </div>
  </div>
  <el-menu :default-active="route" router>
    <template v-for="menu in menus">
      <el-sub-menu v-if="menu.children && menu.children.length" :key="menu.value" :index="menu.value">
        <template #title>
          <span>{{ menu.label }}</span>
        </template>
        <el-menu-item v-for="child in menu.children" :key="child.value" :index="child.value">
          <template #title>
            <span>{{ child.label }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :key="menu.id" :index="menu.value">
        <template #title>
          <span>{{ menu.label }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/system/user'
import { Menu } from '@/types/menu'
import router from '@/router/index'

const menus = ref<Menu[]>([])
const route = router.currentRoute.value.path

onMounted(async () => {
  // getUserInfo by ??
  const user = await loadUserInfo(6)
  menus.value = [].concat(...(user as any).roles.map((item: any) => item.menus))
})

const loadUserInfo = (id: number) => {
  return getUserInfo(id)
}

</script>

<style lang="scss" scoped>
.el-menu {
  min-height:calc(100vh - 60px);
  text-align: center;
}

.el-menu-item {
  text-align: center;
}

.aside-header{
  height: 60px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  .aside-header-title {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    text-align: center;
  }
}

.el-menu-item:hover,
:deep(.el-sub-menu__title):hover
{
  background-color: $menu-hover-bg-color;
}

.el-menu-item.is-active {
  color: $primary-color;
  background-color: $menu-active-bg-color;
}

</style>
