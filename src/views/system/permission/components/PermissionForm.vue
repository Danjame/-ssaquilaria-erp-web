<template>
  <Dialog :title="id ? '编辑权限' : '新增权限'" :submit="handleSubmit">
    <el-form ref="form" :model="permission" :rules="rules" label-width="100px">
      <el-form-item label="权限名" prop="name">
        <el-input v-model="permission.name" placeholder="请输入权限名" />
      </el-form-item>
      <el-form-item label="资源接口" prop="value">
        <el-input v-model="permission.value" placeholder="请输入资源接口" />
      </el-form-item>
      <el-form-item label="权限标签" prop="label">
        <el-input v-model="permission.label" placeholder="请输入权限标签" />
      </el-form-item>
      <el-form-item label="请求方法" prop="actionIds">
        <el-select v-model="permission.actionIds" multiple placeholder="请选择权限">
          <el-option v-for="(action, i) in actions" :key="i" :label="action.label" :value="action.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllActions } from '@/api/system/action'
import { Action } from '@/api/system/types/action'
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
    { required: true, message: '权限名不能为空', trigger: 'change' }
  ],
  value: [
    { required: true, message: '资源接口不能为空', trigger: 'change' }
  ],
  label: [
    { required: true, message: '权限标签不能为空', trigger: 'change' }
  ],
  actionIds: [
    { required: false, message: '请求方法不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  loadAllActions()
  if (props.id) loadPermission()
})

// 方法
const actions = ref<Action[]>()
const loadAllActions = async () => {
  actions.value = await getAllActions()
}

// 权限
const permission = reactive({
  name: '',
  value: '',
  label: '',
  actionIds: [] as number[]
})
const loadPermission = async () => {
  const {
    name,
    value,
    label,
    actions
  } = await getPermissionById(props.id)

  Object.assign(permission, {
    name,
    value,
    label,
    actionIds: actions ? actions.map(action => action.id) : []
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
