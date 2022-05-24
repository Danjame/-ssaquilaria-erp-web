<template>
  <Dialog title="补种树木" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="tree" label-width="100px">
      <el-form-item label="树木品种" prop="name">
        <el-input v-model="tree.name" placeholder="请输入树木品种" />
      </el-form-item>
      <el-form-item label="种植时间" prop="plantedAt">
        <el-date-picker v-model="tree.plantedAt" type="date" placeholder="请输入种植时间" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { TreeAttrs } from '@/api/forest/types/tree'
import { getTreeById, replaceTree } from '@/api/forest/tree'

const props = defineProps({
  id: {
    type: Number,
    required: true,
    default: null
  }
})

const rules = reactive({
  name: [
    { required: false, message: '树木品种不能为空', trigger: 'change' }
  ],
  plantedAt: [
    { required: true, message: '种植时间不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  loadTree()
})

// 树木信息
const tree = reactive({} as TreeAttrs)
const loadTree = async () => {
  const { name, plantedAt } = await getTreeById(props.id)
  Object.assign(tree, { name, plantedAt })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await replaceTree(props.id, tree)
  ElMessage.success('更新成功')
  emit('submit')
}

</script>
