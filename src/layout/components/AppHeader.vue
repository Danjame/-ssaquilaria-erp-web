<template>
  <el-row class="container">
    <el-col :span="12">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item
          v-for="path in paths"
          :key="path"
        >
          {{ path === '' ? '首页' : breadcrumbTitle[path] }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="12" class="userInfo">
      <el-space>
        <el-dropdown>
          <el-avatar size="default" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </el-col>
  </el-row>
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
.container{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .userInfo {
    display: flex;
    justify-content:end;
  }
}
</style>
