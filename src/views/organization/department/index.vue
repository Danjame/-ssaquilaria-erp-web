<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增部门</el-button>
    </template>
    <el-table :data="departments" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <span>部门成员：</span>
          <el-space>
            <el-tag v-for="user in props.row.users"> {{ user.name }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="name" align="center" />
      <el-table-column label="值" prop="value" align="center" />
      <el-table-column label="部门标签" prop="label" align="center" />
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="openSetting(scope.row.id)">设置</el-button>
            <el-popconfirm
              title="确定要删除该部门吗?"
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
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <DepartmentForm
    v-if="visible"
    v-model="visible"
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
const visible = ref(false)
const departmentId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    departmentId.value = payload
  } else {
    departmentId.value = undefined
  }
  visible.value = true
}

const onSubmitted = (type: string) => {
  if (type && type === 'setting') {
    settingVisible.value = false
  } else {
    visible.value = false
  }
  loadDepartments()
}

// 显示隐藏 setting
const settingVisible = ref(false)
const openSetting = (id: number) => {
  departmentId.value = id
  settingVisible.value = true
}

const handleDelete = async (id: number) => {
  await deleteDepartment(id)
  ElMessage.success('删除成功')
  loadDepartments()
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadDepartments()
})
</script>

<style lang="scss" scoped>

</style>
