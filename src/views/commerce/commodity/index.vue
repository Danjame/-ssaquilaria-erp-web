<template>
  <Index
    title="商品"
    :params="listParams"
    :count="count"
    :data="commodities"
    :load="loadCommodities"
    :handler-btns="false"
  >
    <template #form-item>
      <el-form-item label="序列号" prop="serialNum">
        <el-input v-model="listParams.serialNum" placeholder="请输入序列号" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="listParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="(status, i) in statuses" :key="i" :label="status.label" :value="status.value" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序列号" prop="serialNum" align="center" />
      <el-table-column label="产品" align="center">
        <template #default="scope">
          <span>{{ scope.row.transaction?.product?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产区" align="center">
        <el-table-column label="林场" align="center">
          <template #default="scope">
            <span>{{ scope.row.transaction.product?.material?.farm ? scope.row.transaction.product?.material?.farm?.name : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="林区" align="center">
          <template #default="scope">
            <span>{{ scope.row.transaction.product?.material?.area ? scope.row.transaction.product?.material?.area?.name : '-' }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="批次" align="center">
        <template #default="scope">
          <span>{{ scope.row.transaction ? moment(scope.row.transaction.createdAt).format('YYYY/MM/DD HH:mm') : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === AVAILABLE" type="success">未售</el-tag>
          <el-tag v-else type="danger">已售</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="目标客户" align="center">
        <template #default="scope">
          <span>{{ scope.row.client ? scope.row.client.nickname : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查询次数" prop="queryCount" align="center" />
      <el-table-column label="操作" min-width="150" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="downloadQRCode(scope.row)">下载二维码</el-button>
            <el-popconfirm title="确定要删除该商品项吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
  </Index>
</template>

<script lang="ts" setup>
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getCommoditiesByConditions, deleteCommodity } from '@/api/commerce/commodity'
import { Commodity } from '@/api/commerce/types/commodity'
import { AVAILABLE, SOLD } from '@/utils/constants'
import moment from 'moment'
import QRCode from 'qrcode'

const statuses = [
  {
    label: '未售',
    value: AVAILABLE
  },
  {
    label: '已售',
    value: SOLD
  }
]

onMounted(() => {
  loadAllProducts()
  loadCommodities()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  products.value = await getAllProducts()
}

// 商品列表
const listParams = reactive({
  serialNum: undefined,
  productId: undefined,
  status: undefined,
  page: 1,
  size: 10
})
const commodities = ref<Commodity[]>([])
const count = ref(0)
const loadCommodities = async () => {
  const data = await getCommoditiesByConditions(listParams)
  commodities.value = data.results
  count.value = data.count
}

// 下载二维码
const downloadQRCode = async (commodity: Commodity) => {
  const canvas = document.createElement('canvas')

  QRCode.toCanvas(canvas, commodity.traceNum, { margin: 6 }, error => {
    ElMessage.error('下载失败：' + error.message)
  })
  const ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.font = '14px Arial'
    ctx.fillText(commodity.serialNum, 23, 158)
  }

  const a = document.createElement('a')
  a.href = canvas.toDataURL()
  a.download = `${commodity.transaction.product.name}_${commodity.serialNum}`
  a.click()
  a.remove()
}

const handleDelete = async (id: number) => {
  await deleteCommodity(id)
  ElMessage.success('删除成功')
  loadCommodities()
}

// 监听参数变化
watch(() => listParams.serialNum, num => {
  listParams.serialNum = !num ? undefined : num
})
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
watch(() => listParams.status, status => {
  listParams.status = !status ? undefined : status
})
</script>

<style lang="scss" scoped>

</style>
