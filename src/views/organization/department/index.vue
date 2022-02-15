<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增部门</el-button>
    </template>
    <el-table :data="departments" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column type="expand">
        <template #default="props">
          <el-space>
            <span>部门成员（{{ props.row.users.length }} 人）:</span>
            <el-tag v-for="user in props.row.users" size="large">{{ user.name }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="name" align="center" />
      <el-table-column label="部门编号" prop="value" align="center" />
      <el-table-column label="部门标签" prop="label" align="center" />
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="openSetting(scope.row.id)">设置</el-button>
            <el-popconfirm title="确定要删除该部门吗?" @confirm="handleDelete(scope.row.id)">
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
      :load-list="loadDepartments"
    />
  </el-card>
  <DepartmentForm
    v-if="formVisible"
    v-model="formVisible"
    :id="departmentId"
    @submit="onSubmitted"
  />
  <DepartmentSetting
    v-if="settingVisible"
    v-model="settingVisible"
    :id="departmentId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import DepartmentForm from './components/DepartmentForm.vue'
import DepartmentSetting from './components/DepartmentSetting.vue'
import { getDepartmentsByConditions, deleteDepartment } from '@/api/organization/department'
import { Department } from '@/api/organization/types/department'
import store from '@/store'

onMounted(() => {
  loadDepartments()
})

// 类别列表
const listParams = reactive({
  page: 1,
  size: 10
})
const departments = ref<Department[]>([])
const count = ref(0)
const loadDepartments = async () => {
  const { results, total } = await getDepartmentsByConditions(listParams)
  departments.value = results
  count.value = total
}

// 显示隐藏 form
const formVisible = ref(false)
const departmentId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    departmentId.value = payload
  } else {
    departmentId.value = undefined
  }
  formVisible.value = true
}

// 显示隐藏 setting
const settingVisible = ref(false)
const openSetting = (id: number) => {
  departmentId.value = id
  settingVisible.value = true
}

const onSubmitted = (type: string) => {
  if (type && type === 'setting') {
    settingVisible.value = false
  } else {
    formVisible.value = false
  }
  loadDepartments()
}

const handleDelete = async (id: number) => {
  await deleteDepartment(id)
  ElMessage.success('删除成功')
  loadDepartments()
  return true
}
</script>

<style lang="scss" scoped>
</style>
