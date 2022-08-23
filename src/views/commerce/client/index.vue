<template>
  <Index
    title="客户"
    :params="listParams"
    :count="count"
    :data="clients"
    :load="loadClients"
    :default-handler="false"
  >
    <template #form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入客户名字" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="listParams.phone" placeholder="请输入客户手机号" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="微信" align="center">
        <el-table-column label="头像" align="center">
          <template #default="scope">
            <el-avatar :src="scope.row?.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template #default="scope">
            <span>{{ scope.row.nickname ? scope.row.nickname : '-' }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="名字" align="center">
        <template #default="scope">
          <span>{{ scope.row.name ? scope.row.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template #default="scope">
          <span>{{ scope.row.gender == 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template #default="scope">
          <span>{{ scope.row.phone ? scope.row.phone : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <ClientForm
        v-if="formVisible"
        v-model="formVisible"
        :id="clientId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import ClientForm from './components/ClientForm.vue'
import { Client } from '@/api/commerce/types/client'
import { getClientsByConditions } from '@/api/commerce/client'

onMounted(() => {
  loadClients()
})

// 客户列表
const listParams = reactive({
  name: undefined,
  phone: undefined,
  page: 1,
  size: 10
})
const clients = ref<Client[]>([])
const count = ref(0)
const loadClients = async () => {
  const data = await getClientsByConditions(listParams)
  clients.value = data.results
  count.value = data.count
}

// 编辑组件
const formVisible = ref(false)
const clientId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    clientId.value = payload
    formVisible.value = true
  }
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadClients()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
watch(() => listParams.phone, phone => {
  listParams.phone = !phone ? undefined : phone
})
</script>

<style lang="scss" scoped>

</style>
