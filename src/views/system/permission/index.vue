<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增权限</el-button>
    </template>
    <el-table :data="permissions" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column label="权限名" prop="name" align="center" />
      <el-table-column label="资源接口" prop="value" align="center" />
      <el-table-column label="权限标签" prop="label" align="center" />
      <el-table-column label="请求方法" align="center">
        <template #default="scope">
          <el-space>
            <el-tag v-for="action in scope.row.actions"> {{ action.label }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm
              title="确定要删除该权限吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadPermissions"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <PermissionForm
    v-if="visible"
    v-model="visible"
    :id="permissionId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import PermissionForm from './components/PermissionForm.vue'
import { Permission } from '@/api/system/types/permission'
import { getPermissionsByConditions, deletePermission } from '@/api/system/permission'
import store from '@/store'

onMounted(() => {
  loadPermissions()
})

// 权限列表
const listParams = reactive({
  page: 1,
  size: 10
})
const permissions = ref<Permission[]>([])
const count = ref(0)
const loadPermissions = async () => {
  const { results, total } = await getPermissionsByConditions(listParams)
  permissions.value = results
  count.value = total
}

// 显示隐藏 form
const visible = ref(false)
const permissionId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    permissionId.value = payload
  } else {
    permissionId.value = undefined
  }
  visible.value = true
}

const onSubmitted = () => {
  visible.value = false
  loadPermissions()
}

const handleDelete = async (id: number) => {
  await deletePermission(id)
  ElMessage.success('删除成功')
  loadPermissions()
  return true
}
</script>

<style lang="scss" scoped>

</style>
