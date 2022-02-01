<template>
  <el-card>
    <template #header>
      <el-form inline>
        <el-form-item label="销售单号">
          <el-input v-model="listParams.orderNum">
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
          <el-input v-model="listParams.customerId">
            <template #append>
              <el-button :icon="'Search'" @click="loadSales" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="dialogVisible = true">新增销售</el-button>
    </template>
    <el-table :data="sales" style="width: 100%">
      <el-table-column label="销售单号" prop="orderNum" align="center" />
      <el-table-column label="产品名称" align="center">
        <template #default="scope">
          <span>{{ scope.row.product.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" prop="customerId" align="center" />
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="金额" prop="amount" align="center" />
      <el-table-column label="备注" prop="comment" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="'InfoFilled'"
              icon-color="red"
              title="确定要删除该销售订单吗?"
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
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    title="新增销售"
  >
    <Create :products="products" @close="dialogVisible = false" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Create from './components/Create.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getSalesByConditions, deleteSaleById } from '@/api/inventory/sale'
import { Sale } from '@/api/inventory/types/sale'

onMounted(() => {
  loadAllProducts()
  loadSales()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  const results = await getAllProducts()
  products.value = results
}

// 采购列表
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
  const { results, total } = await getSalesByConditions(listParams)
  sales.value = results
  count.value = total
}

// 显示隐藏 dialog
const dialogVisible = ref(false)

const handleDelete = async (id: number) => {
  await deleteSaleById(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadSales()
})
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
