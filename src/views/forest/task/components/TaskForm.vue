<template>
  <Dialog :title="!task.status ? '审核工单' : '工单详情'" :submit="handleSubmit">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="操作时间" align="center">{{ moment(task.startedAt).format('YYYY/MM/DD HH:mm') }}</el-descriptions-item>
      <el-descriptions-item label="林区" align="center">
        <el-tag v-if="task.farm && task.area">{{ task.farm.name + ': ' + task.area.name }}</el-tag>
        <el-space wrap>
          <el-tag v-for="(area, i) in task.areas" :key="i">{{ area.farm.name + ': ' + area.name }}</el-tag>
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item align="center">
        <template #label>
          <span>树木（{{ task.treeCount }} 棵）</span>
        </template>
        <el-space wrap>
          <el-tag v-for="(tree, i) in task.trees" :key="i">{{ tree.serialNum }}</el-tag>
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item label="记录类" align="center">{{ task.operType?.name }}</el-descriptions-item>
      <el-descriptions-item label="记录项" align="center">{{ task.operItem?.name }}</el-descriptions-item>
      <el-descriptions-item label="数据" align="center">{{ task.operData }}</el-descriptions-item>
      <el-descriptions-item label="用时(分)" align="center">{{ task.duration }}</el-descriptions-item>
      <el-descriptions-item label="申请人" align="center">{{ task.operator?.name }}</el-descriptions-item>
      <el-descriptions-item label="备注" align="center">{{ task.remark }}</el-descriptions-item>
      <el-descriptions-item label="图片" align="center">
        <el-space size="large">
          <el-image
            v-for="(image, i) in task.srcList" :key="i"
            style="height: 100px"
            fit="cover"
            :src="image"
            :preview-src-list="task.srcList"
            :initial-index="i"
          />
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item label="审核人" align="center">{{ task.reviewer?.name }}</el-descriptions-item>
      <el-descriptions-item label="审核状态" align="center">
        <el-select v-model="taskParams.status" placeholder="请选择状态" :disabled="!!task.status">
          <el-option v-for="(item, i) in status" :key="i" :label="item.name" :value="item.value" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item label="审核意见" align="center">
        <el-input v-model="taskParams.review" placeholder="请输入审核意见" type="textarea" autosize :disabled="!!task.status" />
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<script lang="ts" setup>
import { getTaskById, updateTask } from '@/api/forest/task'
import { Task } from '@/api/forest/types/task'
import { downloadImage } from '@/api/file/image'
import moment from 'moment'

const props = defineProps({
  id: {
    type: Number,
    required: true,
    default: null
  }
})

onMounted(() => {
  loadTask()
})

const taskParams = reactive({
  status: undefined as number | undefined,
  review: undefined as string | undefined
})

// 状态
const status = [
  {
    name: '通过',
    value: 1
  },
  {
    name: '拒绝',
    value: 2
  }
]

// 工单信息
const task = reactive({} as Task)
const loadTask = async () => {
  Object.assign(task, await getTaskById(props.id))
  taskParams.status = task.status ? task.status : undefined
  taskParams.review = task.review

  // 图片处理
  if (task.images && task.images.length) task.srcList = await downloadImage(task.images)
}

// 表单提交
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  await updateTask(task.taskNum, taskParams)
  ElMessage.success('更新成功')
  emit('submit')
}

</script>
