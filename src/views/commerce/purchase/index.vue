<template>
  <Index
    title="采购"
    :params="listParams"
    :count="count"
    :data="purchases"
    :load="loadPurchases"
    :handler-a="() => {formVisible = true }"
  >
    <template #form-item>
      <el-form-item label="采购单号" prop="orderNum">
        <el-input v-model="listParams.orderNum" placeholder="请输入采购单号" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="listParams.supplierId" placeholder="请选择供应商" clearable>
          <el-option v-for="(supplier, i) in suppliers" :key="i" :label="supplier.label" :value="supplier.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="采购单号" prop="orderNum" align="center" />
      <el-table-column label="时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.comment ? scope.row.comment : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定要删除该采购订单吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <PurchaseForm
        v-if="formVisible"
        v-model="formVisible"
        :products="products"
        :suppliers="suppliers"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import PurchaseForm from './components/PurchaseForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getAllSuppliers } from '@/api/commerce/supplier'
import { Supplier } from '@/api/commerce/types/supplier'
import { getPurchasesByConditions, deletePurchase } from '@/api/commerce/purchase'
import { Purchase } from '@/api/commerce/types/purchase'
import moment from 'moment'

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
  const data = await getPurchasesByConditions(listParams)
  purchases.value = data.results
  count.value = data.count
}

// 新增组件
const formVisible = ref(false)
const onFormSubmitted = () => {
  formVisible.value = false
  loadPurchases()
}

const handleDelete = async (id: number) => {
  await deletePurchase(id)
  ElMessage.success('删除成功')
  loadPurchases()
}

// 监听参数变化
watch(() => listParams.orderNum, orderNum => {
  listParams.orderNum = !orderNum ? undefined : orderNum
})
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
watch(() => listParams.supplierId, id => {
  listParams.supplierId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
