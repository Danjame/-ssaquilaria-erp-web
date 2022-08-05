<template>
  <Index
    title="角色"
    :params="listParams"
    :count="count"
    :data="roles"
    :load="loadRoles"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入角色名称" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="角色权限" align="center" label-class-name="role-desc-label" class-name="role-desc-content">
              <el-space>
                <el-tag v-for="(permission, i) in props.row.permissions" :key="i" size="large">{{ permission.name }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="角色菜单" align="center" label-class-name="role-desc-label" class-name="role-desc-content">
              <el-tree :data="props.row.menus" :props="{ children: 'children', label: 'label' }" />
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色状态" prop="status" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onStatusChange(scope.row)"
            :loading="scope.row.isStatusLoading"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该角色吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <RoleForm
        v-if="formVisible"
        v-model="formVisible"
        :id="roleId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import RoleForm from './components/RoleForm.vue'
import { getRolesByConditions, updateRole, deleteRole } from '@/api/system/role'
import { Role } from '@/api/system/types/role'

onMounted(() => {
  loadRoles()
})

// 角色列表
const listParams = reactive({
  name: undefined,
  page: 1,
  size: 10
})
const roles = ref<Role[]>([])
const count = ref(0)
const loadRoles = async () => {
  const { results, count: total } = await getRolesByConditions(listParams)
  if (results && results.length) {
    results.forEach(item => {
      item.isStatusLoading = false
    })
  }
  roles.value = results
  count.value = total
}

// 新增与编辑组件
const formVisible = ref(false)
const roleId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    roleId.value = payload
  } else {
    roleId.value = undefined
  }
  formVisible.value = true
}

// 角色状态变更
const onStatusChange = async (role: Role) => {
  const { id, status } = role
  role.isStatusLoading = true
  await updateRole(id, { status }).finally(() => {
    role.isStatusLoading = false
  })
  ElMessage.success(`${status ? '启用' : '禁用'}成功`)
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadRoles()
}

const handleDelete = async (id: number) => {
  await deleteRole(id)
  ElMessage.success('删除成功')
  loadRoles()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
</script>

<style lang="scss">
.role-desc-label.el-descriptions__label {
  width: 10%;
}
.role-desc-content.el-descriptions__content {
  width: 40%;
  .el-space--horizontal {
    flex-wrap: wrap;
  }
}
</style>
