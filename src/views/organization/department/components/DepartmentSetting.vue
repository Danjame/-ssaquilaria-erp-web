<template>
  <Dialog :title="`部门成员（${userIds?.length} 人）`" :submit="handleSubmit">
    <el-table :data="users" style="width: 100%" ref="multipleTable" @selection-change="onSelect">
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
import { ElTable } from 'element-plus'

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
const multipleTable = ref<typeof ElTable>()
const selectDefault = () => {
  userIds.value?.forEach((id: number) => {
    users.value.forEach((user: User) => {
      if (id === user.id) multipleTable.value!.toggleRowSelection(user, true)
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
  await updateDepartment(props.id, { userIds: userIds.value })
  ElMessage.success('更新成功')
  emit('submit', 'setting')
}

</script>
