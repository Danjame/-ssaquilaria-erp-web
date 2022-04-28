<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :model="listParams" :disabled="store.state.isLoading">
        <el-form-item label="记录类" prop="operTypeId">
          <el-select v-model="listParams.operTypeId" placeholder="请选择记录类" clearable>
            <el-option v-for="operType in operTypes" :key="operType.id" :label="operType.name" :value="operType.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录项" prop="operItemId">
          <el-select v-model="listParams.operItemId" placeholder="请选择记录项" clearable>
            <el-option v-for="operItem in operItems" :key="operItem.id" :label="operItem.name" :value="operItem.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="listParams.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="loadTasks">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tasks" v-loading="store.state.isLoading">
      <el-table-column type="expand">
        <template #default="scope">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="树木" align="center" label-class-name="task-desc-label">
              <span v-if="!scope.row.trees.length">-</span>
              <el-space v-else>
                <el-tag v-for="(tree, index) in scope.row.trees" :key="index">{{ tree.serialNum }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="备注" align="center" label-class-name="task-desc-label">{{ scope.row.remark ? scope.row.remark : '-' }}</el-descriptions-item>
            <el-descriptions-item label="审核人" align="center" label-class-name="task-desc-label">{{ scope.row.reviewer?.name }}</el-descriptions-item>
            <el-descriptions-item label="审核意见" align="center" label-class-name="task-desc-label">{{ scope.row.review }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:MM') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm ? scope.row.farm.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林区" align="center">
        <template #default="scope">
          <span>{{ scope.row.area ? scope.row.area.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="棵数" prop="treeCount" align="center" />
      <el-table-column label="记录类" align="center">
        <template #default="scope">
          <span>{{ scope.row.operType?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录项" align="center">
        <template #default="scope">
          <span>{{ scope.row.operItem ? scope.row.operItem.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据" align="center">
        <template #default="scope">
          <span>{{ scope.row.operData ? scope.row.operData : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用时(分)" prop="duration" align="center" />
      <el-table-column label="申请人" align="center">
        <template #default="scope">
          <span>{{ scope.row.operator?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">驳回</el-tag>
          <el-tag v-else type="warning">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button type="text" @click="openForm(scope.row.id)">{{ scope.row.status === 0 ? '审核' : '查看' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadTasks"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <TaskForm
    v-if="formVisible"
    v-model="formVisible"
    :id="taskId"
    @submit="onFormSubmitted"
  />
</template>

<script lang="ts" setup>
import TaskForm from './components/TaskForm.vue'
import { getAllOperTypes } from '@/api/forest/opertype'
import { OperType } from '@/api/forest/types/opertype'
import { getOperItemsByOperType } from '@/api/forest/operitem'
import { OperItem } from '@/api/forest/types/operitem'
import { getTasksByConditions } from '@/api/forest/task'
import { Task } from '@/api/forest/types/task'
import store from '@/store'
import moment from 'moment'

onMounted(() => {
  loadAllOperTypes()
  loadTasks()
})

// 操作项
const operTypes = ref<OperType[]>([])
const loadAllOperTypes = async () => {
  operTypes.value = await getAllOperTypes()
}

// 记录项
const operItems = ref<OperItem[]>([])
const loadOperItemsByOperType = async (id: number) => {
  operItems.value = await getOperItemsByOperType(id)
}

// 状态
const status = [
  {
    name: '待审核',
    value: 0
  },
  {
    name: '已审核',
    value: 3
  },
  {
    name: '通过',
    value: 1
  },
  {
    name: '拒绝',
    value: 2
  }
]

// 工单列表
const listParams = reactive({
  operTypeId: undefined,
  operItemId: undefined,
  status: undefined,
  page: 1,
  size: 10
})
const tasks = ref<Task[]>([])
const count = ref(0)
const loadTasks = async () => {
  const data = await getTasksByConditions(listParams)
  tasks.value = data.results
  count.value = data.count
}

const form = ref<typeof ElForm>()
const resetFields = (form: ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  loadTasks()
}

// 审查组件
const taskId = ref(undefined as number | undefined)
const formVisible = ref(false)
const openForm = (payload: number) => {
  taskId.value = payload
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadTasks()
}

// 监听参数变化
watch(() => listParams.operTypeId, id => {
  listParams.operTypeId = !id ? undefined : id
  if (id) loadOperItemsByOperType(id)
})
watch(() => listParams.operItemId, id => {
  listParams.operItemId = !id ? undefined : id
})
watch(() => listParams.status, status => {
  listParams.status = status === '' ? undefined : status
})
</script>

<style lang="scss">
.task-desc-label.el-descriptions__label {
  width: 20%;
}
</style>
