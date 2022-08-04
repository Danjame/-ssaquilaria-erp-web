<template>
  <Dialog :title="id ? '编辑部门' : '新增部门'" :submit="handleSubmit">
    <el-form ref="form" :model="department" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="department.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="department.remark" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createDepartment, getDepartmentById, updateDepartment } from '@/api/organization/department'
import { DepartmentAttrs } from '@/api/organization/types/department'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadDepartment()
})

// 部门信息
const department = reactive({} as DepartmentAttrs)
const loadDepartment = async () => {
  const { name, remark } = await getDepartmentById(props.id)
  Object.assign(department, { name, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
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
