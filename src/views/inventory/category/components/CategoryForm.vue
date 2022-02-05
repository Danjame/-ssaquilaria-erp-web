<template>
  <Dialog
    :title="id ? '编辑类别' : '新增类别'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="category" :rules="rules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="category.name" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="category.value" />
      </el-form-item>
      <el-form-item label="分类标签" prop="label">
        <el-input v-model="category.label" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createCategory, getCategoryById, updateCategory } from '@/api/inventory/category'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '分类名', trigger: 'change' }
  ],
  value: [
    { required: true, message: '分类值', trigger: 'change' }
  ],
  label: [
    { required: true, message: '分类标签', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadCategory()
})

// 类别信息
const category = reactive({
  name: '',
  value: '',
  label: ''
})
const loadCategory = async () => {
  const { name, value, label } = await getCategoryById(props.id)
  Object.assign(category, { name, value, label })
}

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createCategory(category)
    ElMessage.success('新增成功')
  } else {
    await updateCategory(props.id, category)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
