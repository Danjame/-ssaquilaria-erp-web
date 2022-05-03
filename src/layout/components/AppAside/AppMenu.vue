<template>
  <el-menu :default-active="route" router :collapse="store.state.isCollapse">
    <template v-for="(menu, i) in menus">
      <el-sub-menu v-if="menu.children && menu.children.length" :key="i" :index="menu.value">
        <template #title>
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.label }}</span>
        </template>
        <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.value">
          <template #title>
            <el-icon>
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.label }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :key="menu.id" :index="menu.value">
        <template #title>
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.label }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import store from '@/store'
import router from '@/router'

const menus = store.state.menus
const route = router.currentRoute.value.path

</script>

<style lang="scss" scoped>
.el-menu {
  min-height:calc(100vh - 60px);
  border-right: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-item:hover, :deep(.el-sub-menu__title):hover {
  background-color: $menu-hover-bg-color;
}
.el-menu-item.is-active {
  color: $menu-active-color;
  background-color: $menu-active-bg-color;
}
</style>
