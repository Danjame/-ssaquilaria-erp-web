<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :disabled="store.state.isLoading">
        <el-form-item label="角色名称">
          <el-input v-model="listParams.name" placeholder="请输入角色名称">
            <template #append>
              <el-button :icon="'Search'" @click="loadRoles" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增角色</el-button>
    </template>
    <el-table :data="roles" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions border>
            <el-descriptions-item label="角色权限">
              <el-space>
                <el-tag
                  v-for="permission in props.row.permissions"
                  size="large"
                >{{ permission.label }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="角色菜单">
              <el-tree :data="props.row.menus" :props="menuTreeProps" />
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center" />
      <el-table-column label="角色编号" prop="value" align="center" />
      <el-table-column label="角色标签" prop="label" align="center" />
      <el-table-column label="角色状态" prop="status" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onStatusChange(scope.row)"
            :loading="scope.row.isStatusLoading"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该角色吗?" @confirm="handleDelete(scope.row.id)">
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
      :load-list="loadRoles"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <RoleForm
    v-if="visible"
    v-model="visible"
    :id="roleId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import RoleForm from './components/RoleForm.vue'
import { getRolesByConditions, updateRole, deleteRole } from '@/api/system/role'
import { Role } from '@/api/system/types/role'
import store from '@/store'

onMounted(() => {
  loadRoles()
})

// 角色列表
const listParams = reactive({
  name: undefined,
  page: 1,
  size: 10
})
const roles = ref<Role[]>([])
const count = ref(0)
const loadRoles = async () => {
  const { results, total } = await getRolesByConditions(listParams)
  results.forEach(item => {
    item.isStatusLoading = false
  })
  roles.value = results
  count.value = total
}

// 菜单
const menuTreeProps = {
  children: 'children',
  label: 'label',
}

// 显示隐藏 form
const visible = ref(false)
const roleId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    roleId.value = payload
  } else {
    roleId.value = undefined
  }
  visible.value = true
}

// 角色状态变更
const onStatusChange = async (role: Role) => {
  const { id, status } = role
  role.isStatusLoading = true
  await updateRole(id, { status }).finally(() => {
    role.isStatusLoading = false
  })
  ElMessage.success(`${status ? '启用' : '禁用'}成功`)
}

const onSubmitted = () => {
  visible.value = false
  loadRoles()
}

const handleDelete = async (id: number) => {
  await deleteRole(id)
  ElMessage.success('删除成功')
  loadRoles()
  return true
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
</script>

<style lang="scss" scoped>
</style>

