<template>
  <Dialog
    :title="id ? '编辑角色' : '新增角色'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="role" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编号" prop="value">
        <el-input v-model="role.value" placeholder="请输入角色编号" />
      </el-form-item>
      <el-form-item label="角色标签" prop="lebal">
        <el-input v-model="role.label" placeholder="请输入角色标签" />
      </el-form-item>
      <el-form-item label="角色权限" prop="permissionIds">
        <el-select v-model="role.permissionIds" multiple placeholder="请选择权限">
          <el-option
            v-for="permission in permissions"
            :key="permission.value"
            :label="permission.label"
            :value="permission.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色菜单" prop="menuIds">
        <el-tree
          :data="menus"
          show-checkbox
          node-key="id"
          :default-checked-keys="role.menuIds"
          :props="defaultProps"
          @check="onCheck"
          v-loading="menusLoading"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllPermissions } from '@/api/system/permission'
import { Permission } from '@/api/system/types/permission'
import { getAllMenus } from '@/api/system/menu'
import { Menu } from '@/api/system/types/menu'
import { getRoleById, updateRole } from '@/api/system/role'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '角色名称不能为空', trigger: 'change' }
  ],
  value: [
    { required: true, message: '角色编号不能为空', trigger: 'change' }
  ],
  label: [
    { required: true, message: '角色标签不能为空', trigger: 'change' }
  ],
  permissionIds: [
    { required: false, message: '角色权限不能为空', trigger: 'change' }
  ],
  menuIds: [
    { required: false, message: '角色菜单不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  loadAllPermissions()
  loadAllMenus()
  if (props.id) loadRole()
})

// 权限信息
const permissions = ref<Permission[] | null>(null)
const loadAllPermissions = async () => {
  permissions.value = await getAllPermissions()
}

// 菜单信息
const defaultProps = {
  children: 'children',
  label: 'label',
}
const menus = ref<Menu[]>([])
const menusLoading = ref(false)
const loadAllMenus = async () => {
  menusLoading.value = true
  menus.value = await getAllMenus()
  menusLoading.value = false
}
const onCheck = (menu: Menu, checked: { checkedKeys: number[]}) => {
  role.menuIds = checked.checkedKeys
}

// 角色信息
const role = reactive({
  name: '',
  value: '',
  label: '',
  permissionIds: [],
  menuIds: [] as number []
})
const loadRole = async () => {
  const {
    name,
    value,
    label,
    permissions,
    menuIds
  } = await getRoleById(props.id)

  Object.assign(role, {
    name,
    value,
    label,
    permissionIds: permissions ? permissions.map(permission => permission.id) : [],
    menuIds: menuIds ? menuIds.map(Number) : []
  })
}

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await updateRole(props.id, role)
  ElMessage.success('更新成功')
  
  emit('submit')
}

</script>
