<template>
  <div class="aside-header">
    <!-- <el-image style="width: 50px; height: 50px" :src="logoSrc" fit="fill" /> -->
    <div class="aside-header-title">
      <span>中科沉香ERP系统</span>
    </div>
  </div>
  <el-menu mode="vertical">
    <el-menu-item index="1">
      进销存
    </el-menu-item>
    <el-menu-item index="2">
      组织
    </el-menu-item>
    <el-menu-item index="3">系统</el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { getUserInfo } from '@/api/system/user'

onMounted(async () => {
  const user = await loadUserInfo(6)
  console.log([].concat(...(user as any).roles.map((item: any) => item.menus)))
})

const loadUserInfo = (id: number) => {
  return getUserInfo(id)
}

</script>

<style lang="scss" scoped>
.el-menu {
  min-height:calc(100vh - 60px);
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

</style>
