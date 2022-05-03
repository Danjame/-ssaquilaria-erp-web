<template>
  <Dialog :title="id ? '编辑供应商' : '新增供应商'" :submit="handleSubmit">
    <el-form ref="form" :model="supplier" :rules="rules" label-width="100px">
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="supplier.name" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="供应商编号" prop="value">
        <el-input v-model="supplier.value" placeholder="请输入供应商编号" />
      </el-form-item>
      <el-form-item label="供应商标签" prop="label">
        <el-input v-model="supplier.label" placeholder="请输入供应商标签" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="supplier.description" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createSupplier, getSupplierById, updateSupplier } from '@/api/inventory/supplier'
import { SupplierAttrs } from '@/api/inventory/types/supplier'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '供应商名称不能为空', trigger: 'change' }
  ],
  value: [
    { required: true, message: '供应商编号不能为空', trigger: 'change' }
  ],
  label: [
    { required: true, message: '供应商标签不能为空', trigger: 'change' }
  ],
  description: [
    { required: false, message: '描述不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadSupplier()
})

// 供应商信息
const supplier = reactive({} as SupplierAttrs)
const loadSupplier = async () => {
  const { name, value, label, description } = await getSupplierById(props.id)
  Object.assign(supplier, { name, value, label, description })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createSupplier(supplier)
    ElMessage.success('新增成功')
  } else {
    await updateSupplier(props.id, supplier)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
