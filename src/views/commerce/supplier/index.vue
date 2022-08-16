<template>
  <Index
    title="供应商"
    :params="listParams"
    :count="count"
    :data="suppliers"
    :load="loadSuppliers"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入供应商名称" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="供应商名称" prop="name" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该供应商吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <SupplierForm
        v-if="formVisible"
        v-model="formVisible"
        :id="supplierId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import SupplierForm from './components/SupplierForm.vue'
import { getSuppliersByConditions, deleteSupplier } from '@/api/commerce/supplier'
import { Supplier } from '@/api/commerce/types/supplier'

onMounted(() => {
  loadSuppliers()
})

// 供应商列表
const listParams = reactive({
  name: undefined,
  page: 1,
  size: 10
})
const suppliers = ref<Supplier[]>([])
const count = ref(0)
const loadSuppliers = async () => {
  const data = await getSuppliersByConditions(listParams)
  suppliers.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const supplierId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    supplierId.value = payload
  } else {
    supplierId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadSuppliers()
}

const handleDelete = async (id: number) => {
  await deleteSupplier(id)
  ElMessage.success('删除成功')
  loadSuppliers()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
</script>

<style lang="scss" scoped>

</style>
