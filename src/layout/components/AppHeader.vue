<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item
      v-for="path in paths"
      :key="path"
    >
      {{ path === '' ? '首页' : breadcrumbTitle[path] }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import router from '@/router/index'
import { reactive, watch, ref, onMounted } from 'vue'

const breadcrumbTitle: { [key: string]: string } = {
  inventory: '进销存',
  product: '库存',
  sale: '销售',
  purchase: '采购',
  supplier: '供应商',
  organization: '组织',
  department: '部门',
  system: '系统',
  user: '用户',
  role: '角色',
  permission: '权限',
  menu: '菜单',
  about: '关于'
}

const currentRoute = reactive(router)
const paths = ref<string[]>([])

onMounted(() => {
  paths.value = router.currentRoute.value.path.split('/').splice(1)
})

watch(currentRoute, () => {
  paths.value = router.currentRoute.value.path.split('/').splice(1)
})

</script>

<style lang="scss" scoped>
.el-menu{
  width: 100%;
}
</style>
