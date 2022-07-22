<template>
  <Index
    title="部门"
    :params="listParams"
    :count="count"
    :data="departments"
    :load="loadDepartments"
    :handler-a="openForm"
    :filter="false"
  >
    <template #table-column>
      <el-table-column type="expand">
        <template #default="scope">
          <el-descriptions :column="1" border>
            <el-descriptions-item align="center" label-class-name="department-desc-label">
              <template #label>
                <span>部门成员（{{ scope.row.users.length }} 人）</span>
              </template>
              <span v-if="!scope.row.users.length">-</span>
              <el-space v-else>
                <el-tag v-for="(user, i) in scope.row.users" :key="i" size="large">{{ user.name }}</el-tag>
              </el-space>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="name" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="openSetting(scope.row.id)">配置</el-button>
            <el-popconfirm title="确定要删除该部门吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <DepartmentForm
        v-if="formVisible"
        v-model="formVisible"
        :id="departmentId"
        @submit="onFormSubmitted"
      />
    </template>
    <template #b>
      <DepartmentSetting
        v-if="settingVisible"
        v-model="settingVisible"
        :id="departmentId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
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
  const data = await getDepartmentsByConditions(listParams)
  departments.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const departmentId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    departmentId.value = payload
  } else {
    departmentId.value = undefined
  }
  formVisible.value = true
}

// 配置组件
const settingVisible = ref(false)
const openSetting = (id: number) => {
  departmentId.value = id
  settingVisible.value = true
}

const onFormSubmitted = (type: string) => {
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
}
</script>

<style lang="scss">
.department-desc-label.el-descriptions__label {
  width: 20%;
}
</style>
