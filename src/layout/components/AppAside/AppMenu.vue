<template>
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
import { PropType, toRefs } from 'vue'
import { Menu } from '@/api/system/types/menu'

const props = defineProps({
  menus: {
    type: Object as PropType<Menu[]>,
    required: true
  },
  route: {
    type: String,
    required: true
  }
})

const { menus, route } = toRefs(props)

</script>

<style lang="scss" scoped>
.el-menu {
  min-height:calc(100vh - 60px);
}

.el-menu-item:hover, :deep(.el-sub-menu__title):hover {
  background-color: $menu-hover-bg-color;
}
.el-menu-item.is-active {
  color: $primary-color;
  background-color: $menu-active-bg-color;
}
</style>
