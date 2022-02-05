<template>
  <Dialog
    :title="id ? '编辑产品单位' : '新增产品单位'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="unit" :rules="rules" label-width="100px">
      <el-form-item label="单位名称" prop="name">
        <el-input v-model="unit.name" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="unit.value" />
      </el-form-item>
      <el-form-item label="单位标签" prop="label">
        <el-input v-model="unit.label" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="unit.description" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createUnit, getUnitById, updateUnit } from '@/api/inventory/unit'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '单位名称', trigger: 'change' }
  ],
  value: [
    { required: true, message: '值', trigger: 'change' }
  ],
  label: [
    { required: true, message: '单位标签', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadUnit()
})

// 单位信息
const unit = reactive({
  name: '',
  value: '',
  label: '',
  description: ''
})
const loadUnit = async () => {
  const { name, value, label, description } = await getUnitById(props.id)
  Object.assign(unit, { name, value, label, description })
}

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createUnit(unit)
    ElMessage.success('新增成功')
  } else {
    await updateUnit(props.id, unit)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
