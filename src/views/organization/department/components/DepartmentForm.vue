<template>
  <Dialog
    :title="id ? '编辑部门' : '新增部门'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="department" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="department.name" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="department.value" />
      </el-form-item>
      <el-form-item label="部门标签" prop="label">
        <el-input v-model="department.label" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createDepartment, getDepartmentById, updateDepartment } from '@/api/organization/department'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '部门名称', trigger: 'change' }
  ],
  value: [
    { required: true, message: '值', trigger: 'change' }
  ],
  label: [
    { required: true, message: '部门标签', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadDepartment()
})

// 部门信息
const department = reactive({
  name: '',
  value: '',
  label: ''
})
const loadDepartment = async () => {
  const { name, value, label } = await getDepartmentById(props.id)
  Object.assign(department, { name, value, label })
}

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createDepartment(department)
    ElMessage.success('新增成功')
  } else {
    await updateDepartment(props.id, department)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
