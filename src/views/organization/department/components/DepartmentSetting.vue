<template>
  <Dialog
    title="设置部门成员"
    :submit="handleSubmit"
  >
    <el-table :data="users" style="width: 100%" ref="multipleTableRef" @selection-change="onSelect">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名称" prop="name" align="center" />
      <el-table-column label="用户邮箱" prop="email" align="center" />
    </el-table>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllUsers } from '@/api/system/user'
import { User } from '@/api/system/types/user'
import { getDepartmentById, updateDepartment } from '@/api/organization/department'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

onMounted(async () => {
  await loadAllUsers()
  await loadUserIds()
  selectDefault()
})

// 用户列表
const users = ref<User[]>([])
const loadAllUsers = async () => {
  users.value = await getAllUsers()
}

// 部门成员 id
const userIds = ref<number[] | undefined>(undefined)
const loadUserIds = async () => {
  const { users } = await getDepartmentById(props.id)
  userIds.value = users.map((user: User) => user.id)
}

// 默认选中
const multipleTableRef = ref<typeof ElTable | null>(null)
const selectDefault = () => {
  userIds.value?.forEach((id: number) => {
    users.value.forEach((user: User) => {
      if (id === user.id) multipleTableRef.value!.toggleRowSelection(user, true)
    })
  })
}

// 获取选中 id
const onSelect = (users: User[]) => {
  userIds.value = users.map((user: User) => user.id)
}

// 确定提交
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  await updateDepartment(props.id, { userIds: userIds.value})
  ElMessage.success('更新成功')
  emit('submit', 'setting')
}

</script>
