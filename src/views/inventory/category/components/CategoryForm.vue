<template>
  <Dialog :title="id ? '编辑类别' : '新增类别'" :submit="handleSubmit">
    <el-form ref="form" :model="category" :rules="rules" label-width="100px">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="category.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="category.remark" autosize placeholder="请输入描述" />
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
    { required: true, message: '类别名称不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadCategory()
})

// 类别信息
const category = reactive({} as CategoryAttrs)
const loadCategory = async () => {
  const { name, remark } = await getCategoryById(props.id)
  Object.assign(category, { name, remark })
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
