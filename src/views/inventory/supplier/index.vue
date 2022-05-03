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
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品名称" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="供应商名称" prop="name" align="center" />
      <el-table-column label="供应商编号" prop="value" align="center" />
      <el-table-column label="供应商标签" prop="label" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.description ? scope.row.description : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该供应商吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
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
  products.value = await getAllProducts()
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
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
