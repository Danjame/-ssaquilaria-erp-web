<template>
  <Dialog :title="id ? '编辑类别' : '新增类别'" :submit="handleSubmit">
    <el-form ref="form" :model="category" :rules="rules" label-width="100px">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="category.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="类别编号" prop="value">
        <el-input v-model="category.value" placeholder="请输入类别编号" />
      </el-form-item>
      <el-form-item label="类别标签" prop="label">
        <el-input v-model="category.label" placeholder="请输入类别标签" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createCategory, getCategoryById, updateCategory } from '@/api/inventory/category'
import { CategoryAttrs } from '@/api/inventory/types/category'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '类别名称不能为空', trigger: 'change' }
  ],
  value: [
    { required: true, message: '类别编号不能为空', trigger: 'change' }
  ],
  label: [
    { required: true, message: '类别标签不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadCategory()
})

// 类别信息
const category = reactive({} as CategoryAttrs)
const loadCategory = async () => {
  const { name, value, label } = await getCategoryById(props.id)
  Object.assign(category, { name, value, label })
}

// 表单提交
const form = ref<typeof ElForm>()
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
