<template>
  <Index
    title="工单"
    :params="listParams"
    :count="count"
    :data="tasks"
    :load="loadTasks"
    :default-handler="false"
  >
    <template #form-item>
      <el-form-item label="记录类" prop="operTypeId">
        <el-select v-model="listParams.operTypeId" placeholder="请选择记录类" clearable>
          <el-option v-for="(operType, i) in operTypes" :key="i" :label="operType.name" :value="operType.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="记录项" prop="operItemId">
        <el-select v-model="listParams.operItemId" placeholder="请选择记录项" clearable>
          <el-option v-for="(operItem, i) in operItems" :key="i" :label="operItem.name" :value="operItem.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人" prop="operatorId">
        <el-select v-model="listParams.operatorId" placeholder="请选择操作人" clearable>
          <el-option v-for="(user, i) in users" :key="i" :label="user.name" :value="user.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="reviewerId">
        <el-select v-model="listParams.reviewerId" placeholder="请选择审核人" clearable>
          <el-option v-for="(user, i) in users" :key="i" :label="user.name" :value="user.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="listParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="(item, i) in status" :key="i" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="scope">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="树木编号" align="center" label-class-name="task-desc-label">
              <span v-if="!scope.row.trees.length">-</span>
              <el-space v-else wrap>
                <el-tag v-for="(tree, i) in scope.row.trees" :key="i">{{ tree.serialNum }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="备注" align="center" label-class-name="task-desc-label">{{ scope.row.remark ? scope.row.remark : '-' }}</el-descriptions-item>
            <el-descriptions-item label="审核人" align="center" label-class-name="task-desc-label">{{ scope.row.reviewer?.name }}</el-descriptions-item>
            <el-descriptions-item label="审核意见" align="center" label-class-name="task-desc-label">{{ scope.row.review }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="序号" type="index" align="center" width="60" />
      <el-table-column class-name="task-table-column" label="提交时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="林区" align="center" min-width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.farm && scope.row.area">{{ scope.row.farm.name + ': ' + scope.row.area.name }}</el-tag>
          <el-space v-else>
            <el-tag v-for="(area, i) in scope.row.areas" :key="i">{{ area.farm.name + ': ' + area.name }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="棵数" prop="treeCount" align="center" />
      <el-table-column class-name="task-table-column" label="记录类" align="center">
        <template #default="scope">
          <span>{{ scope.row.operType?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="记录项" align="center">
        <template #default="scope">
          <span>{{ scope.row.operItem ? scope.row.operItem.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="数据" align="center">
        <template #default="scope">
          <span>{{ scope.row.operData ? scope.row.operData : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="用时(分)" prop="duration" align="center" />
      <el-table-column class-name="task-table-column" label="申请人" align="center">
        <template #default="scope">
          <span>{{ scope.row.operator?.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="task-table-column task-picture-table-column" label="图片" align="center">
        <template #default="scope">
          <el-image
            style="width: 50px; height: 50px;"
            fit="cover"
            :src="scope.row.srcList && scope.row.srcList.length ? scope.row.srcList[0] : null"
            :preview-src-list="scope.row.srcList"
          >
            <template #placeholder>
              <div class="image-slot">
                <el-icon><component :is="'Picture'" /></el-icon>
              </div>
            </template>
            <template #error>
              <div class="image-slot">
                <el-icon><component :is="'DocumentDelete'" /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column> -->
      <el-table-column class-name="task-table-column" label="工单状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">驳回</el-tag>
          <el-tag v-else type="warning">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="task-table-column" label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="openForm(scope.row.id)">{{ scope.row.status === 0 ? '审核' : '查看' }}</el-button>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <TaskForm
        v-if="formVisible"
        v-model="formVisible"
        :id="taskId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import TaskForm from './components/TaskForm.vue'
import { getAllOperTypes } from '@/api/forest/opertype'
import { OperType } from '@/api/forest/types/opertype'
import { getOperItemsByOperType } from '@/api/forest/operitem'
import { OperItem } from '@/api/forest/types/operitem'
import { getAllUsers } from '@/api/system/user'
import { User } from '@/api/system/types/user'
import { getTasksByConditions } from '@/api/forest/task'
import { Task } from '@/api/forest/types/task'
// import { downloadImage } from '@/api/file/image'
import moment from 'moment'

onMounted(() => {
  loadAllOperTypes()
  loadAllUsers()
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

// 操作人/审核人
const users = ref<User[]>([])
const loadAllUsers = async () => {
  users.value = await getAllUsers()
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
  operatorId: undefined,
  reviewerId: undefined,
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

  // tasks.value.forEach(async item => {
  //   if (item.images && item.images.length) item.srcList = await downloadImage(item.images)
  // })
}

// 审查组件
const taskId = ref<number | undefined>(undefined)
const formVisible = ref(false)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') taskId.value = payload
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadTasks()
}

// 监听参数变化
watch(() => listParams.operTypeId, id => {
  listParams.operItemId = undefined
  if (id) {
    listParams.operTypeId = id
    loadOperItemsByOperType(id)
  } else {
    listParams.operTypeId = undefined
    operItems.value = []
  }
})
watch(() => listParams.operItemId, id => {
  listParams.operItemId = !id ? undefined : id
})
watch(() => listParams.operatorId, id => {
  listParams.operatorId = !id ? undefined : id
})
watch(() => listParams.reviewerId, id => {
  listParams.reviewerId = !id ? undefined : id
})
watch(() => listParams.status, status => {
  listParams.status = status === '' ? undefined : status
})
</script>

<style lang="scss">
.task-desc-label.el-descriptions__label {
  width: 20%;
}

.task-table-column {

  &.el-table__cell {
    position: static;
  }
}

.el-table__body-wrapper .task-picture-table-column .cell {
  line-height: 0px;

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}
</style>
