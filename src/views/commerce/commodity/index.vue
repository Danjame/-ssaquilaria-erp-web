<template>
  <Index
    title="商品"
    :params="listParams"
    :count="count"
    :data="commodities"
    :on-data-select="handleSelection"
    :load="loadCommodities"
    :default-handler="false"
  >
    <template #form-item>
      <el-form-item label="商品编号" prop="serialNum">
        <el-input v-model="listParams.serialNum" placeholder="请输入商品编号" />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable :disabled="listParams.productSerialNum">
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品编码" prop="productSerialNum">
        <el-input v-model="listParams.productSerialNum" placeholder="请输入产品编码" :disabled="listParams.productId" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="listParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="(status, i) in statuses" :key="i" :label="status.label" :value="status.value" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-header>
      <el-button
        class="download-qrcode"
        type="primary"
        :icon="'Download'"
        :disabled="!selection || selection.length === 0"
        @click="downloadLabels"
      >
        下载标签
      </el-button>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="props">
          <h3 style="margin-left: 11px;">客户信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="客户微信名" align="center" label-class-name="commodity-desc-label">
              {{ props.row.client ? props.row.client.nickname : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="查询次数" align="center" label-class-name="commodity-desc-label">
              {{ props.row.queryCount }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="ID" align="center">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编号" prop="serialNum" align="center" />
      <el-table-column label="产品名称" align="center">
        <template #default="scope">
          <span>{{ scope.row.product?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center">
        <template #default="scope">
          <span>{{ scope.row.product?.serialNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center">
        <template #default="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center">
        <template #default="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.material?.farm ? scope.row.material.farm.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林区" align="center">
        <template #default="scope">
          <span>{{ scope.row.material?.area ? scope.row.material.area.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批次" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === AVAILABLE" type="success">未售</el-tag>
          <el-tag v-else type="danger">已售</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="定价（元）" align="center">
        <template #default="scope">
          <span>{{ scope.row.fixedPrice ? scope.row.fixedPrice : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进价（元）" align="center">
        <template #default="scope">
          <span>{{ scope.row.purchasePrice ? scope.row.purchasePrice : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价（元）" align="center">
        <template #default="scope">
          <span>{{ scope.row.salePrice ? scope.row.salePrice : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-button type="primary" link @click="downloadLabel(scope.row)">下载标签</el-button>
            <el-popconfirm title="确定要删除该商品项吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <CommodityForm
        v-if="formVisible"
        v-model="formVisible"
        :id="commodityId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import CommodityForm from './components/CommodityForm.vue'
import { getAllProducts } from '@/api/manufacture/product'
import { Product } from '@/api/manufacture/types/product'
import { getCommoditiesByConditions, deleteCommodity } from '@/api/commerce/commodity'
import { Commodity } from '@/api/commerce/types/commodity'
import { AVAILABLE, SOLD } from '@/utils/constants'
import moment from 'moment'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import mpCodeSrc from '@/assets/mp_code.jpg'

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
  productSerialNum: undefined,
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

// 下载标签
const downloadLabel = (commodity: Commodity) => {
  const width = 150

  // 二维码
  const qrCanvas = document.createElement('canvas')
  QRCode.toCanvas(qrCanvas, commodity.traceNum, { width }, error => {
    if (error) ElMessage.error('下载失败：' + error.message)
  })

  // 条形码
  const barCanvas = document.createElement('canvas')
  JsBarcode(barCanvas, commodity.serialNum, { height: 50 })

  // 标签
  const canvas = document.createElement('canvas')
  canvas.width = barCanvas.width
  canvas.height = 410
  const ctx = canvas.getContext('2d')

  // 小程序码
  const mpCode = new Image()
  mpCode.src = mpCodeSrc

  mpCode.onload = () => {
    if (ctx) {
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'

      ctx.fillText('1、微信扫一扫', (barCanvas.width - width) / 2, width / 2 - 5)
      ctx.fillText('进入官方小程序', (barCanvas.width - width) / 2, width / 2 + 15)
      ctx.drawImage(mpCode, barCanvas.width - width, 0, width, width)

      ctx.fillText('2、点击“扫码查询”', (barCanvas.width - width) / 2 + width, width / 2 + width - 5)
      ctx.fillText('验证防伪码', (barCanvas.width - width) / 2 + width, width / 2 + width + 15)
      ctx.drawImage(qrCanvas, 0, width)

      ctx.font = '15px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${commodity.product.name} | ${commodity.size} | ${commodity.weight}`, barCanvas.width / 2, width * 2 + 15)
      ctx.drawImage(barCanvas, 0, width * 2 + 20)

      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.download = `${commodity.product.name}_${commodity.serialNum}`
      a.click()
      a.remove()
    }
  }
}

const downloadLabels = () => {
  selection.value.forEach(item => {
    downloadLabel(item)
  })
}

const handleDelete = async (id: number) => {
  await deleteCommodity(id)
  ElMessage.success('删除成功')
  loadCommodities()
}

const selection = ref<Commodity[]>([])
const handleSelection = (commodities: Commodity[]) => {
  selection.value = commodities
}

// 编辑组件
const formVisible = ref(false)
const commodityId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    commodityId.value = payload
    formVisible.value = true
  }
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadCommodities()
}

// 监听参数变化
watch(() => listParams.serialNum, num => {
  listParams.serialNum = !num ? undefined : num
})
watch(() => listParams.productId, id => {
  if (!id) {
    listParams.productId = undefined
  } else {
    listParams.productId = id
    listParams.productSerialNum = undefined
  }
})
watch(() => listParams.productSerialNum, num => {
  if (!num) {
    listParams.productSerialNum = undefined
  } else {
    listParams.productSerialNum = num
    listParams.productId = undefined
  }
})
watch(() => listParams.status, status => {
  listParams.status = !status ? undefined : status
})
</script>

<style lang="scss">
.el-button.is-disabled.download-qrcode {
  background-color: var(--el-color-info-light-7);
  border-color: var(--el-border-color);
}
.commodity-desc-label.el-descriptions__label {
  width: 20%;
}
</style>
