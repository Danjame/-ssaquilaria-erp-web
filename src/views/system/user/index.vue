<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :disabled="store.state.isLoading">
        <el-form-item label="用户名称">
          <el-input v-model="listParams.name" placeholder="请输入用户名称">
            <template #append>
              <el-button :icon="'Search'" @click="loadUsers" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="listParams.departmentId" placeholder="请选择部门" clearable>
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.name"
              :value="department.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="users" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column label="用户名称" prop="name" align="center" />
      <el-table-column label="用户邮箱" prop="email" align="center" />
      <el-table-column label="最近登录时间" align="center">
        <template #default="scope">
        {{ new Date(Date.parse(scope.row.lastLogin)).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center">
        <template #default="scope">
          <el-space>
            <el-tag v-for="role in scope.row.roles"> {{ role.label }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" prop="status" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onStatusChange(scope.row)"
            :loading="scope.row.isStatusLoading"
            :disabled="scope.row.name === store.state.user?.name"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该用户吗?" @confirm="handleDelete(scope.row.id)">
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
      :load-list="loadUsers"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <UserForm
    v-if="visible"
    v-model="visible"
    :id="userId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import UserForm from './components/UserForm.vue'
import { getAllDepartments } from '@/api/organization/department'
import { Department } from '@/api/organization/types/department'
import { getUsersByConditions, updateUser, deleteUser } from '@/api/system/user'
import { User } from '@/api/system/types/user'
import store from '@/store'

onMounted(() => {
  loadAllDepartments()
  loadUsers()
})

// 部门
const departments = ref<Department[]>([])
const loadAllDepartments = async () => {
  departments.value = await getAllDepartments()
}

// 用户列表
const listParams = reactive({
  name: undefined,
  departmentId: undefined,
  page: 1,
  size: 10
})
const users = ref<User[]>([])
const count = ref(0)
const loadUsers = async () => {
  const { results, total } = await getUsersByConditions(listParams)
  results.forEach(item => {
    item.isStatusLoading = false
  })
  users.value = results
  count.value = total
}

// 显示隐藏 form
const visible = ref(false)
const userId = ref(undefined as number | undefined)
const openForm = (payload: number) => {
  userId.value = payload
  visible.value = true
}

// 用户状态变更
const onStatusChange = async (user: User) => {
  const { id, status } = user
  user.isStatusLoading = true
  await updateUser(id, { status }).finally(() => {
    user.isStatusLoading = false
  })
  ElMessage.success(`${status ? '启用' : '禁用'}成功`)
}

const onSubmitted = () => {
  visible.value = false
  loadUsers()
}

const handleDelete = async (id: number) => {
  await deleteUser(id)
  ElMessage.success('删除成功')
  loadUsers()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
watch(() => listParams.departmentId, departmentId => {
  listParams.departmentId = !departmentId ? undefined : departmentId
  loadUsers()
})
</script>

<style lang="scss" scoped>
</style>
