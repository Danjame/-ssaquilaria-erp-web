<template>
  <Index
    title="销售"
    :params="listParams"
    :count="count"
    :data="sales"
    :load="loadSales"
    :handler-a="() => { saleFormVisible = true }"
  >
    <template #form-item>
      <el-form-item label="单号" prop="orderNum">
        <el-input v-model="listParams.orderNum" placeholder="请输入单号" />
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="listParams.customer" placeholder="请输入客户名" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="props">
          <h3 style="margin-left: 12px;">商品</h3>
          <el-table :data="props.row.commodities" border>
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="ID" align="center">
              <template #default="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品编号" prop="serialNum" align="center" />
            <el-table-column label="商品名称" align="center">
              <template #default="scope">
                <span>{{ scope.row.product ? scope.row.product.name : '-' }}</span>
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
            <el-table-column label="单位" align="center">
              <template #default="scope">
                <span>{{ scope.row.product?.unit ? scope.row.product.unit.name : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="售价(元)" prop="salePrice" align="center" />
          </el-table>
          <h3 style="margin-left: 12px;">退换历史</h3>
          <el-table :data="props.row.changes" border>
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="时间" align="center">
              <template #default="scope">
                <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="退货" min-width="200" align="center">
              <template #default="scope">
                <el-row class="change-leave-label-row">
                  <el-col :span="12">编号</el-col>
                  <el-col :span="12">退款(元)</el-col>
                </el-row>
                <el-row class="change-leave-value-row" v-for="(item, i) in scope.row.return" :key="i">
                  <el-col :span="12">{{ item }}</el-col>
                  <el-col class="change-leave-value-row-right" :span="12">{{ scope.row.refund[i] ? '-' + scope.row.refund[i] : 0 }}</el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="补货" min-width="200" align="center">
              <template #default="scope">
                <el-row class="change-leave-label-row">
                  <el-col :span="12">编号</el-col>
                  <el-col :span="12">售价(元)</el-col>
                </el-row>
                <el-row class="change-leave-value-row" v-for="(item, i) in scope.row.leave" :key="i">
                  <el-col :span="12">{{ item }}</el-col>
                  <el-col class="change-leave-value-row-right" :span="12">{{ scope.row.charge[i] ?? 0 }}</el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="退/补(元)" prop="amount" align="center" />
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
      <el-table-column label="商品数量" align="center">
        <template #default="scope">
          <template v-for="(item, i) in Object.keys(scope.row.resume)" :key="i">
            <el-tag type="info">{{ item + ': ' + scope.row.resume[item] }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="总数" prop="quantity" align="center" />
      <el-table-column label="金额(元)" prop="amount" align="center" />
      <el-table-column label="客户" prop="customer" align="center" />
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="130" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openChangeForm(scope.row.id)">退换处理</el-button>
            <el-popconfirm title="确定要删除该订单吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <SaleForm v-if="saleFormVisible" v-model="saleFormVisible" @submit="onSaleFormSubmitted" />
    </template>
    <template #b>
      <ChangeForm v-if="changeFormVisible" v-model="changeFormVisible" :id="saleId" @submit="onChangeFormSubmitted" />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import SaleForm from './components/SaleForm.vue'
import ChangeForm from './components/ChangeForm.vue'
import { getAllProducts } from '@/api/manufacture/product'
import { Product } from '@/api/manufacture/types/product'
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
  customer: undefined,
  productId: undefined,
  page: 1,
  size: 10
})
const sales = ref<Sale[]>([])
const count = ref(0)
const loadSales = async () => {
  const data = await getSalesByConditions(listParams)
  data.results.forEach(s => {
    s.resume = {}
    s.commodities.forEach(c => {
      if (!s.resume[c.product.name]) {
        s.resume[c.product.name] = 1
      } else {
        s.resume[c.product.name] += 1
      }
    })
  })
  sales.value = data.results
  count.value = data.count
}

// 新增组件
const saleFormVisible = ref(false)

const onSaleFormSubmitted = () => {
  saleFormVisible.value = false
  loadSales()
}

// 变更组件
const saleId = ref<number | undefined>(undefined)
const changeFormVisible = ref(false)
const openChangeForm = (id: number) => {
  saleId.value = id
  changeFormVisible.value = true
}

const onChangeFormSubmitted = () => {
  changeFormVisible.value = false
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
watch(() => listParams.customer, customer => {
  listParams.customer = !customer ? undefined : customer
})
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>
.change-leave-label-row {
  font-size: small;
}

.change-leave-value-row {
  font-size: small;
  border-top: 1px solid var(--el-table-border-color);

  &-right {
    border-left: 1px solid var(--el-table-border-color);
  }
}
</style>
