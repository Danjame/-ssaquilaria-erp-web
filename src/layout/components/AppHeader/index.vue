<template>
  <el-row class="container">
    <el-col :span="12">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item
          v-for="(route, index) in routes"
          :key="index"
        >
          {{ route.meta.title }}
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
import { computed } from 'vue'

const routes = computed(() => {
  return router.currentRoute.value.matched.filter(item => item.meta.title)
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
