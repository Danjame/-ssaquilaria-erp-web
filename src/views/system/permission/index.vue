<template>
  <Index
    title="权限"
    :params="listParams"
    :count="count"
    :data="permissions"
    :load="loadPermissions"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="权限名" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入权限名" />
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-input v-model="listParams.label" placeholder="请输入标签" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="权限名" prop="name" align="center" />
      <el-table-column label="标签" prop="label" align="center" />
      <el-table-column label="资源接口" prop="url" align="center" />
      <el-table-column label="请求方法" align="center">
        <template #default="scope">
          <el-space>
            <el-tag> {{ scope.row.method }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该权限吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <PermissionForm
        v-if="formVisible"
        v-model="formVisible"
        :id="permissionId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import PermissionForm from './components/PermissionForm.vue'
import { Permission } from '@/api/system/types/permission'
import { getPermissionsByConditions, deletePermission } from '@/api/system/permission'

onMounted(() => {
  loadPermissions()
})

// 权限列表
const listParams = reactive({
  name: undefined,
  label: undefined,
  page: 1,
  size: 10
})
const permissions = ref<Permission[]>([])
const count = ref(0)
const loadPermissions = async () => {
  const data = await getPermissionsByConditions(listParams)
  permissions.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const permissionId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    permissionId.value = payload
  } else {
    permissionId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadPermissions()
}

const handleDelete = async (id: number) => {
  await deletePermission(id)
  ElMessage.success('删除成功')
  loadPermissions()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
watch(() => listParams.label, label => {
  listParams.label = !label ? undefined : label
})
</script>

<style lang="scss" scoped>

</style>
