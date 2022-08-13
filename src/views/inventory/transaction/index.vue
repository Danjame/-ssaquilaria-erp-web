<template>
  <Index
    title="库存变动"
    :params="listParams"
    :count="count"
    :data="transactions"
    :load="loadTransactions"
    :handler-a="() => {formVisible = true }"
  >
    <template #form-item>
      <el-form-item label="变动形式" prop="method">
        <el-select v-model="listParams.method" placeholder="请选择变动形式" clearable>
          <el-option v-for="(method, i) in methods" :key="i" :label="method.label" :value="method.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="变动类型" prop="type">
        <el-select v-model="listParams.type" placeholder="请选择变动类型" clearable>
          <el-option v-for="(type, i) in types" :key="i" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="资产类型" prop="target">
        <el-select v-model="listParams.target" placeholder="请选择资产类型" clearable>
          <el-option v-for="(target, i) in targets" :key="i" :label="target.label" :value="target.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable :disabled="listParams.target && listParams.target != PRODUCT">
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="原料" prop="materialId">
        <el-select v-model="listParams.materialId" placeholder="请选择原料" clearable :disabled="listParams.target && listParams.target != MATERIAL">
          <el-option v-for="(material, i) in materials" :key="i" :label="material.name" :value="material.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="苗木" prop="seedlingId">
        <el-select v-model="listParams.seedlingId" placeholder="请选择苗木" clearable :disabled="listParams.target && listParams.target != SEEDLING">
          <el-option v-for="(seedling, i) in seedlings" :key="i" :label="seedling.name" :value="seedling.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="时间" width="90" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动形式" align="center">
        <template #default="scope">
          <span>{{ methods.find(i => i['value'] === scope.row.method)?.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动类型" align="center">
        <template #default="scope">
          <span>{{ types.find(i => i['value'] === scope.row.type)?.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产类型" align="center">
        <template #default="scope">
          <span>{{ scope.row.product ? '产品' : (scope.row.material ? '原料' : '苗木') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产名称" align="center">
        <template #default="scope">
          <span>{{ scope.row.product ? scope.row.product.name : (scope.row.material ? scope.row.material.name : scope.row.seedling.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="原料消耗" align="center">
        <template #default="scope">
          <span>{{ scope.row.weight ? scope.row.weight : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定要删除该变动吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <TransactionForm
        v-if="formVisible"
        v-model="formVisible"
        :products="products"
        :materials="materials"
        :seedlings="seedlings"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import TransactionForm from './components/TransactionForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getAllMaterials } from '@/api/inventory/material'
import { Material } from '@/api/inventory/types/material'
import { getAllSeedlings } from '@/api/inventory/seedling'
import { Seedling } from '@/api/inventory/types/seedling'
import { getTransactionsByConditions, deleteTransaction } from '@/api/inventory/transaction'
import { Transaction } from '@/api/inventory/types/transaction'
import moment from 'moment'
import { DECR, INCR, LOSS, MATERIAL, PROD, PRODUCT, SEEDLING, TAR } from '@/utils/constants'

const types = [
  {
    label: '入库',
    value: INCR
  },
  {
    label: '出库',
    value: DECR
  }
]

const methods = [
  {
    label: '生产',
    value: PROD
  },
  {
    label: '贸易',
    value: TAR
  },
  {
    label: '折损',
    value: LOSS
  }
]

const targets = [
  {
    label: '产品',
    value: PRODUCT
  },
  {
    label: '原料',
    value: MATERIAL
  },
  {
    label: '苗木',
    value: SEEDLING
  }
]

onMounted(() => {
  loadAllProducts()
  loadAllMaterials()
  loadAllSeedlings()
  loadTransactions()
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

// 苗木
const seedlings = ref<Seedling[]>([])
const loadAllSeedlings = async () => {
  seedlings.value = await getAllSeedlings()
}

// 销售列表
const listParams = reactive({
  type: undefined,
  method: undefined,
  target: undefined,
  productId: undefined,
  materialId: undefined,
  seedlingId: undefined,
  page: 1,
  size: 10
})
const transactions = ref<Transaction[]>([])
const count = ref(0)
const loadTransactions = async () => {
  const data = await getTransactionsByConditions(listParams)
  transactions.value = data.results
  count.value = data.count
}

// 新增组件
const formVisible = ref(false)

const onFormSubmitted = () => {
  formVisible.value = false
  loadTransactions()
}

const handleDelete = async (id: number) => {
  await deleteTransaction(id)
  ElMessage.success('删除成功')
  loadTransactions()
}

// 监听参数变化
watch(() => listParams.type, type => {
  listParams.type = !type ? undefined : type
})
watch(() => listParams.method, method => {
  listParams.method = !method ? undefined : method
})
watch(() => listParams.target, target => {
  listParams.target = !target ? undefined : target
})
watch(() => listParams.productId, id => {
  listParams.productId = !id ? undefined : id
})
watch(() => listParams.materialId, id => {
  listParams.materialId = !id ? undefined : id
})
watch(() => listParams.seedlingId, id => {
  listParams.seedlingId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
