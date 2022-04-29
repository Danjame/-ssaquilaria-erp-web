<template>
  <Dialog title="编辑用户" :submit="handleSubmit">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="user.name" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="user.email" placeholder="请输入用户邮箱" />
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIds">
        <el-select v-model="user.roleIds" multiple placeholder="请选择用户角色" :disabled="user.name === store.state.user?.name">
          <el-option v-for="(role, i) in roles" :key="i" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllRoles } from '@/api/system/role'
import { Role } from '@/api/system/types/role'
import { getUserById, updateUser } from '@/api/system/user'
import store from '@/store'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '用户名称不能为空', trigger: 'change' }
  ],
  email: [
    { required: true, message: '用户邮箱不能为空', trigger: 'change' }
  ],
  roleIds: [
    { required: false, message: '用户角色不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  loadAllRoles()
  loadUser()
})

const roles = ref<Role[]>()
const loadAllRoles = async () => {
  roles.value = await getAllRoles()
}

// 用户信息
const user = reactive({})
const loadUser = async () => {
  const { name, email, roles } = await getUserById(props.id)
  Object.assign(user, { name, email, roleIds: roles.map(role => role.id) })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await updateUser(props.id, user)
  ElMessage.success('更新成功')

  emit('submit')
}

</script>
