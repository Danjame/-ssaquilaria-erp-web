<template>
  <Dialog :title="!task.status ? '审核工单' : '工单详情'" :submit="handleSubmit">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="时间" align="center">{{ moment(task.starteddAt).format('YYYY/MM/DD HH:MM') }}</el-descriptions-item>
      <el-descriptions-item label="项目" align="center">{{ task.operType?.name }}</el-descriptions-item>
      <el-descriptions-item label="林场" align="center">{{ task.farm?.name }}</el-descriptions-item>
      <el-descriptions-item label="内容" align="center">{{ task.operItem?.name }}</el-descriptions-item>
      <el-descriptions-item label="区域" align="center">{{ task.area?.name }}</el-descriptions-item>
      <el-descriptions-item label="数据" align="center">{{ task.operData }}</el-descriptions-item>
      <el-descriptions-item label="树木" align="center">
        <el-tag v-for="(tree, index) in task.trees" :key="index">{{ tree.serialNum }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="用时(分)" align="center">{{ task.duration }}</el-descriptions-item>
      <el-descriptions-item label="棵数" align="center">{{ task.treeCount }}</el-descriptions-item>
      <el-descriptions-item label="备注" align="center">{{ task.remark }}</el-descriptions-item>
      <el-descriptions-item label="申请人" align="center">{{ task.operator?.name }}</el-descriptions-item>
      <el-descriptions-item label="审核人" align="center">{{ task.reviewer?.name }}</el-descriptions-item>
      <el-descriptions-item label="审核状态" align="center">
        <el-select v-model="taskParams.status" placeholder="请选择状态" clearable :disabled="task.status">
          <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item label="审核意见" align="center">
        <el-input v-model="taskParams.review" placeholder="请输入审核意见" type="textarea" autosize :disabled="task.status" />
      </el-descriptions-item>
      <el-descriptions-item label="图片" align="center">
        <el-space size="large">
          <el-image v-for="(image, index) in task.imgSrc" :key="index" style="height: 100px" fit="cover" :src="image" :preview-src-list="task.imgSrc" />
        </el-space>
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<script lang="ts" setup>
import { getTaskById, updateTask } from '@/api/forest/task'
import { downloadImage } from '@/api/file/image'
import moment from 'moment'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

onMounted(() => {
  loadTask()
})

const taskParams = reactive({
  status: undefined,
  review: undefined
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
const task = reactive({
  imgSrc: []
})
const loadTask = async () => {
  Object.assign(task, await getTaskById(props.id))
  taskParams.status = task.status ? task.status : undefined
  taskParams.review = task.review

  // 图片处理
  task.imgSrc = await downloadImage(task.images)
}

// 表单提交
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  await updateTask(task.taskNum, taskParams)
  ElMessage.success('更新成功')
  emit('submit')
}

</script>
