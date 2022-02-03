<template>
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
    <el-form-item>
      <el-button type="primary" @click="handleSumit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
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
  if (id.value) loadCategory()
})

// 类别信息
const category = reactive({
  name: '',
  value: '',
  label: ''
})

// 表单提交
const { id } = toRefs(props)
const loadCategory = async () => {
  const { name, value, label } = await getCategoryById(id.value)
  Object.assign(category, { name, value, label })
}
const form = ref<InstanceType<typeof ElForm> | null>(null)
const emit = defineEmits(['close'])
const handleSumit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!id.value) {
    await createCategory(category)
    ElMessage.success('新增成功')
  } else {
    await updateCategory(id.value, category)
    ElMessage.success('更新成功')
  }
  emit('close')
}

</script>
