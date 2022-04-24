<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :disabled="store.state.isLoading">
        <el-form-item label="销售单号">
          <el-input v-model="listParams.orderNum" placeholder="请输入销售单号">
            <template #append>
              <el-button :icon="'Search'" @click="loadSales" />
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
        <el-form-item label="客户编号">
          <el-input v-model="listParams.customerId" placeholder="请输入客户编号">
            <template #append>
              <el-button :icon="'Search'" @click="loadSales" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="visible = true">新增销售</el-button>
    </template>
    <el-table :data="sales" style="width: 100%" v-loading="store.state.isLoading">
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
      <el-table-column label="备注" prop="comment" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-popconfirm title="确定要删除该销售订单吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadSales"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <SaleForm
    v-if="visible"
    v-model="visible"
    :products="products"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import SaleForm from './components/SaleForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getSalesByConditions, deleteSale } from '@/api/inventory/sale'
import { Sale } from '@/api/inventory/types/sale'
import store from '@/store'
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

// 显示隐藏 form
const visible = ref(false)

const onSubmitted = () => {
  visible.value = false
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
watch(() => listParams.customerId, customerId => {
  listParams.customerId = !customerId ? undefined : customerId
})
watch(() => listParams.productId, productId => {
  listParams.productId = !productId ? undefined : productId
  loadSales()
})
</script>

<style lang="scss" scoped>

</style>
