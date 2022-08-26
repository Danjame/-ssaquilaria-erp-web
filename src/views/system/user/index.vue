<template>
  <Index
    title="用户"
    :params="listParams"
    :count="count"
    :data="users"
    :load="loadUsers"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-select v-model="listParams.departmentId" placeholder="请选择部门" clearable>
          <el-option v-for="(department, i) in departments" :key="i" :label="department.name" :value="department.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="用户名" prop="name" align="center" />
      <el-table-column label="手机号码" prop="phone" align="center" />
      <el-table-column label="用户邮箱" prop="email" align="center" />
      <el-table-column label="最近登录时间" align="center">
        <template #default="scope">
          {{ new Date(Date.parse(scope.row.lastLogin)).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center">
        <template #default="scope">
          <el-space direction="vertical">
            <el-tag v-for="(role, i) in scope.row.roles" :key="i"> {{ role.name }}</el-tag>
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
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该用户吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <UserForm
        v-if="formVisible"
        v-model="formVisible"
        :id="userId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
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
  const { results, count: total } = await getUsersByConditions(listParams)
  if (results && results.length) {
    results.forEach(item => {
      item.isStatusLoading = false
    })
  }
  users.value = results
  count.value = total
}

// 新增与编辑组件
const formVisible = ref(false)
const userId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    userId.value = payload
  } else {
    userId.value = undefined
  }
  formVisible.value = true
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

const onFormSubmitted = () => {
  formVisible.value = false
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
watch(() => listParams.departmentId, id => {
  listParams.departmentId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>
</style>
