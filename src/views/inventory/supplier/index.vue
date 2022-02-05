<template>
  <el-card>
    <template #header>
      <el-form ref="form">
        <el-form-item label="产品名称">
          <el-select v-model="listParams.productId" placeholder="请选择产品名称" clearable>
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增类别</el-button>
    </template>
    <el-table :data="suppliers" style="width: 100%">
      <el-table-column label="供应商名称" prop="name" align="center" />
      <el-table-column label="值" prop="value" align="center" />
      <el-table-column label="供应商标签" prop="label" align="center" />
      <el-table-column label="描述" prop="description" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="'InfoFilled'"
              icon-color="red"
              title="确定要删除该供应商吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      align="right"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <SupplierForm
    v-if="visible"
    v-model="visible"
    :id="supplierId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import SupplierForm from './components/SupplierForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getSuppliersByConditions, deleteSupplier } from '@/api/inventory/supplier'
import { Supplier } from '@/api/inventory/types/supplier'

onMounted(() => {
  loadAllProducts()
  loadSuppliers()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  const results = await getAllProducts()
  products.value = results
}

// 类别列表
const listParams = reactive({
  productId: undefined,
  page: 1,
  size: 10
})
const suppliers = ref<Supplier[]>([])
const count = ref(0)
const loadSuppliers = async () => {
  const { results, total } = await getSuppliersByConditions(listParams)
  suppliers.value = results
  count.value = total
}

// 显示隐藏 dialog
const visible = ref(false)
const supplierId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    supplierId.value = payload
  } else {
    supplierId.value = undefined
  }
  visible.value = true
}

const onSubmitted = () => {
  visible.value = false
  loadSuppliers()
}

const handleDelete = async (id: number) => {
  await deleteSupplier(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadSuppliers()
})
watch(() => listParams.productId, productId => {
  listParams.productId = !productId ? undefined : productId
  loadSuppliers()
})
</script>

<style lang="scss" scoped>

</style>
