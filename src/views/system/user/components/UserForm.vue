<template>
  <Dialog :title="id ? '编辑用户' : '新增用户'" :submit="handleSubmit">
    <el-form ref="form" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="user.name" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="user.email" placeholder="请输入用户邮箱" />
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIds">
        <el-select
          v-model="user.roleIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择用户角色"
          :disabled="user.name === store.state.user?.name"
        >
          <el-option v-for="(role, i) in roles" :key="i" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllRoles } from '@/api/system/role'
import { Role } from '@/api/system/types/role'
import { createUser, getUserById, updateUser } from '@/api/system/user'
import { UserAttrs } from '@/api/system/types/user'
import store from '@/store'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '用户邮箱不能为空', trigger: 'blur' }
  ],
  roleIds: [
    { required: false, message: '用户角色不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  loadAllRoles()
  if (props.id) loadUser()
})

const roles = ref<Role[]>()
const loadAllRoles = async () => {
  roles.value = await getAllRoles()
}

// 用户信息
const user = reactive({} as UserAttrs)
const loadUser = async () => {
  const { name, phone, email, roles } = await getUserById(props.id)
  Object.assign(user, { name, phone, email, roleIds: roles.map(role => role.id) })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // // 验证通过
  if (!props.id) {
    await createUser(user)
    ElMessage.success('新增成功')
  } else {
    await updateUser(props.id, user)
    ElMessage.success('更新成功')
  }

  emit('submit')
}

</script>
