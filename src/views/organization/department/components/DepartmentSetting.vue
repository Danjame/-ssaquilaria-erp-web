<template>
  <Dialog
    title="部门成员"
    :submit="handleSubmit"
  >
    <el-table :data="users" style="width: 100%" ref="multipleTableRef" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名称" prop="name" align="center" />
      <el-table-column label="用户邮箱" prop="email" align="center" />
    </el-table>
  </Dialog>
</template>

<script lang="ts" setup>
import { getDepartmentById, updateDepartment } from '@/api/organization/department'
import { getAllUsers } from '@/api/system/user'
import { User } from '@/api/system/types/user';
import { Department } from '@/api/organization/types/department';

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

onMounted(() => {
  // loadAllUsers()
  loadDepartment()
})

const selectedUsers = ref<User[]>([])
const multipleTableRef = ref<typeof ElTable | null>(null)
const handleSelect = (val: User[]) => {
  // multipleSelection.value = val
  // console.log(val)
}

// 部门信息
const department = reactive({
  users: []
})
const loadDepartment = async () => {
  users.value = await getAllUsers()

  const result = await getDepartmentById(props.id)
  Object.assign(department, result)

  department.users.forEach((user: User) => {
    console.log(user)
    multipleTableRef.value!.toggleRowSelection(user, true)
  })
}

// 用户列表
const users = ref<User[]>([])
const loadAllUsers = async () => {
  users.value = await getAllUsers()
}

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  emit('submit')
}

</script>
