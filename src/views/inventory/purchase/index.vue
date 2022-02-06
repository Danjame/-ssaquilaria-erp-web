<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline>
        <el-form-item label="采购单号">
          <el-input v-model="listParams.orderNum" placeholder="请输入采购单号">
            <template #append>
              <el-button :icon="'Search'" @click="loadPurchases" />
            </template>
          </el-input>
        </el-form-item>
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
        <el-form-item label="供应商">
          <el-select v-model="listParams.supplierId" placeholder="请选择供应商" clearable>
            <el-option
              v-for="supplier in suppliers"
              :key="supplier.value"
              :label="supplier.label"
              :value="supplier.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="visible = true">新增采购</el-button>
    </template>
    <el-table :data="purchases" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column label="采购单号" prop="orderNum" align="center" />
      <el-table-column label="产品名称" align="center">
        <template #default="scope">
          <span>{{ scope.row.product.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center">
        <template #default="scope">
          <span>{{ scope.row.supplier.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="金额" prop="amount" align="center" />
      <el-table-column label="申请人" align="center">
        <template #default="scope">
          <span>{{ scope.row.applicant.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="comment" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-popconfirm
              title="确定要删除该采购订单吗?"
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
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <PurchaseForm
    v-if="visible"
    v-model="visible"
    :products="products"
    :suppliers="suppliers"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import PurchaseForm from './components/PurchaseForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getAllSuppliers } from '@/api/inventory/supplier'
import { Supplier } from '@/api/inventory/types/supplier'
import { getPurchasesByConditions, deletePurchase } from '@/api/inventory/purchase'
import { Purchase } from '@/api/inventory/types/purchase'
import store from '@/store'

onMounted(() => {
  loadAllProducts()
  loadAllSuppliers()
  loadPurchases()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  products.value = await getAllProducts()
}

// 供应商
const suppliers = ref<Supplier[]>([])
const loadAllSuppliers = async () => {
  const results = await getAllSuppliers()
  suppliers.value = results
}

// 采购列表
const listParams = reactive({
  orderNum: undefined,
  productId: undefined,
  supplierId: undefined,
  page: 1,
  size: 10
})
const purchases = ref<Purchase[]>([])
const count = ref(0)
const loadPurchases = async () => {
  const { results, total } = await getPurchasesByConditions(listParams)
  purchases.value = results
  count.value = total
}

// 显示隐藏 form
const visible = ref(false)

const onSubmitted = () => {
  visible.value = false
  loadPurchases()
}

const handleDelete = async (id: number) => {
  await deletePurchase(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadPurchases()
})
watch(() => listParams.orderNum, orderNum => {
  listParams.orderNum = !orderNum ? undefined : orderNum
})
watch(() => [listParams.productId, listParams.supplierId], ([productId, supplierId]) => {
  listParams.productId = !productId ? undefined : productId
  listParams.supplierId = !supplierId ? undefined : supplierId
  loadPurchases()
})
</script>

<style lang="scss" scoped>

</style>
