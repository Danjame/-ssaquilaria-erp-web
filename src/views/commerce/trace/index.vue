<template>
  <Index
    title="溯源"
    :params="listParams"
    :count="count"
    :data="traces"
    :load="loadTraces"
    :handler-btns="false"
  >
    <template #form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="溯源码" prop="code" align="center" />
      <el-table-column label="查询次数" prop="queryCount" align="center" />
      <el-table-column label="产品" align="center">
        <template #default="scope">
          <span>{{ scope.row.transaction?.product?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template #default="scope">
          <qrcode-vue :value="scope.row.code" :size="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-popconfirm title="确定要删除该溯源项吗?" @confirm="handleDelete(scope.row.id)">
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
import QrcodeVue from 'qrcode.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getTracesByConditions, deleteTrace } from '@/api/commerce/trace'
import { getAllMaterials } from '@/api/inventory/material'
import { Material } from '@/api/inventory/types/material'
import { Trace } from '@/api/commerce/types/trace'

onMounted(() => {
  loadAllProducts()
  loadAllMaterials()
  loadTraces()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  products.value = await getAllProducts()
}

// 原料
const materials = ref<Material[]>([])
const loadAllMaterials = async () => {
  materials.value = await getAllMaterials()
}

// 溯源列表
const listParams = reactive({
  productId: undefined,
  page: 1,
  size: 10
})
const traces = ref<Trace[]>([])
const count = ref(0)
const loadTraces = async () => {
  const data = await getTracesByConditions(listParams)
  traces.value = data.results
  count.value = data.count
}

// 新增与编辑组件
// const formVisible = ref(false)
// const traceId = ref<number | undefined>(undefined)
// const openForm = (payload: number | MouseEvent) => {
//   if (typeof payload === 'number') {
//     traceId.value = payload
//   } else {
//     traceId.value = undefined
//   }
//   formVisible.value = true
// }

// const onFormSubmitted = () => {
//   formVisible.value = false
//   loadTraces()
// }

const handleDelete = async (id: number) => {
  await deleteTrace(id)
  ElMessage.success('删除成功')
  loadTraces()
}

// 监听参数变化
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
