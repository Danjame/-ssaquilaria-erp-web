<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openCreateOrEdit">新增部门</el-button>
    </template>
    <el-table :data="departments" style="width: 100%">
      <el-table-column label="部门名称" prop="name" align="center" />
      <el-table-column label="值" prop="value" align="center" />
      <el-table-column label="部门标签" prop="label" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openCreateOrEdit(scope.row.id)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="'InfoFilled'"
              icon-color="red"
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
      align="right"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    :title="departmentId ? '编辑部门' : '新增部门'"
  >
    <CreateOrEdit :id="departmentId" @close="dialogVisible = false;" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'
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

// 显示隐藏 dialog
const dialogVisible = ref(false)
const departmentId = ref(undefined as number | undefined)
const openCreateOrEdit = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    departmentId.value = payload
  } else {
    departmentId.value = undefined
  }
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  await deleteDepartment(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadDepartments()
})
</script>

<style lang="scss" scoped>

</style>
