<template>
  <Dialog :title="id ? '编辑权限' : '新增权限'" :submit="handleSubmit">
    <el-form ref="form" :model="permission" :rules="rules" label-width="100px">
      <el-form-item label="权限名" prop="name">
        <el-input v-model="permission.name" placeholder="请输入权限名" />
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-input v-model="permission.label" placeholder="请输入权限标签" />
      </el-form-item>
      <el-form-item label="资源接口" prop="url">
        <el-input v-model="permission.url" placeholder="请输入资源接口" />
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-input v-model="permission.method" placeholder="请输入请求方法" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="permission.remark" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createPermission, getPermissionById, updatePermission } from '@/api/system/permission'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '权限名不能为空', trigger: 'blur' }
  ],
  label: [
    { required: true, message: '标签不能为空', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '资源接口不能为空', trigger: 'blur' }
  ],
  method: [
    { required: false, message: '请求方法不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadPermission()
})

// 权限
const permission = reactive({
  name: '',
  label: '',
  url: '',
  method: '',
  remark: '',
  actionIds: [] as number[]
})
const loadPermission = async () => {
  const {
    name,
    label,
    url,
    method,
    remark
  } = await getPermissionById(props.id)

  Object.assign(permission, {
    name,
    label,
    url,
    method,
    remark
  })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createPermission(permission)
    ElMessage.success('新增成功')
  } else {
    await updatePermission(props.id, permission)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
