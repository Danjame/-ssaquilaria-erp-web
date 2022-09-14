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
        <el-input v-model="listParams.orderNum" placeholder="请输入单号" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="listParams.supplierId" placeholder="请选择供应商" clearable>
          <el-option v-for="(supplier, i) in suppliers" :key="i" :label="supplier.name" :value="supplier.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="props">
          <h3 style="margin-left: 11px;">明细</h3>
          <el-table v-if="props.row.commodities.length" :data="props.row.commodities" border>
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="ID" align="center">
              <template #default="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品" align="center">
              <template #default="scope">
                <span>{{ scope.row.product ? scope.row.product.name + ' (' + scope.row.product.serialNum + ')' : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="编号" align="center">
              <template #default="scope">
                <span>{{ scope.row.serialNum ? scope.row.serialNum : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center">
              <template #default="scope">
                <span>{{ scope.row.size ? scope.row.size : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="重量" align="center">
              <template #default="scope">
                <span>{{ scope.row.weight ? scope.row.weight : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进价(元)" prop="purchasePrice" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="单号" prop="orderNum" align="center" />
      <el-table-column label="时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center">
        <template #default="scope">
          <span>{{ scope.row.supplier.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" align="center">
        <template #default="scope">
          <template v-for="(item, i) in Object.keys(scope.row.resume)" :key="i">
            <el-tag type="info">{{ item + ': ' + scope.row.resume[item] }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="总数" prop="quantity" align="center" />
      <el-table-column label="金额" prop="amount" align="center" />
      <el-table-column label="申请人" align="center">
        <template #default="scope">
          <span>{{ scope.row.applicant.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.returned" type="danger">退货</el-tag>
          <el-tag v-else type="success">正常</el-tag>
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
import { getAllProducts } from '@/api/manufacture/product'
import { Product } from '@/api/manufacture/types/product'
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
  data.results.forEach(p => {
    p.resume = {}
    p.commodities.forEach(c => {
      if (!p.resume[c.product.name]) {
        p.resume[c.product.name] = 1
      } else {
        p.resume[c.product.name] += 1
      }
    })
  })
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
.el-tag + .el-tag {
  margin-left: 5px;
  margin-top: 5px;
}
</style>
