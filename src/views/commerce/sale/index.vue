<template>
  <Index
    title="销售"
    :params="listParams"
    :count="count"
    :data="sales"
    :load="loadSales"
    :handler-a="() => {formVisible = true }"
  >
    <template #form-item>
      <el-form-item label="销售单号" prop="orderNum">
        <el-input v-model="listParams.orderNum" placeholder="请输入销售单号" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品名称" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户编号" prop="customerId">
        <el-input v-model="listParams.customerId" placeholder="请输入客户编号" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="销售单号" prop="orderNum" align="center" />
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
      <el-table-column label="客户编号" prop="customerId" align="center" />
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="金额" prop="amount" align="center" />
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.comment ? scope.row.comment : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定要删除该销售订单吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <SaleForm
        v-if="formVisible"
        v-model="formVisible"
        :products="products"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import SaleForm from './components/SaleForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getSalesByConditions, deleteSale } from '@/api/commerce/sale'
import { Sale } from '@/api/commerce/types/sale'
import moment from 'moment'

onMounted(() => {
  loadAllProducts()
  loadSales()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  products.value = await getAllProducts()
}

// 销售列表
const listParams = reactive({
  orderNum: undefined,
  productId: undefined,
  customerId: undefined,
  page: 1,
  size: 10
})
const sales = ref<Sale[]>([])
const count = ref(0)
const loadSales = async () => {
  const data = await getSalesByConditions(listParams)
  sales.value = data.results
  count.value = data.count
}

// 新增组件
const formVisible = ref(false)

const onFormSubmitted = () => {
  formVisible.value = false
  loadSales()
}

const handleDelete = async (id: number) => {
  await deleteSale(id)
  ElMessage.success('删除成功')
  loadSales()
}

// 监听参数变化
watch(() => listParams.orderNum, orderNum => {
  listParams.orderNum = !orderNum ? undefined : orderNum
})
watch(() => listParams.customerId, id => {
  listParams.customerId = !id ? undefined : id
})
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
