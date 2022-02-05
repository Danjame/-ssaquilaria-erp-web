<template>
  <Dialog
    :title="id ? '编辑供应商' : '新增供应商'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="supplier" :rules="rules" label-width="100px">
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="supplier.name" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="supplier.value" />
      </el-form-item>
      <el-form-item label="供应商标签" prop="label">
        <el-input v-model="supplier.label" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="supplier.description" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createSupplier, getSupplierById, updateSupplier } from '@/api/inventory/supplier'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '供应商名称', trigger: 'change' }
  ],
  value: [
    { required: true, message: '值', trigger: 'change' }
  ],
  label: [
    { required: true, message: '供应商标签', trigger: 'change' }
  ]
})

onMounted(() => {
  if (id.value) loadSupplier()
})

// 供应商信息
const supplier = reactive({
  name: '',
  value: '',
  label: '',
  description: ''
})

// 表单提交
const { id } = toRefs(props)
const loadSupplier = async () => {
  const { name, value, label, description } = await getSupplierById(id.value)
  Object.assign(supplier, { name, value, label, description })
}
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!id.value) {
    await createSupplier(supplier)
    ElMessage.success('新增成功')
  } else {
    await updateSupplier(id.value, supplier)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
