<template>
  <Index
    title="出入库"
    :params="listParams"
    :count="count"
    :data="movements"
    :load="loadMovements"
    :default-handler="false"
  >
    <template #form-item>
      <el-form-item label="出｜入" prop="type">
        <el-select v-model="listParams.type" placeholder="请选择出｜入" clearable>
          <el-option v-for="(type, i) in types" :key="i" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料类型" prop="target">
        <el-select v-model="listParams.target" placeholder="物料类型" clearable>
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
      <el-form-item label="苗木" prop="saplingId">
        <el-select v-model="listParams.saplingId" placeholder="请选择苗木" clearable :disabled="listParams.target && listParams.target != SAPLING">
          <el-option v-for="(sapling, i) in saplings" :key="i" :label="sapling.name" :value="sapling.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #form-item-button>
      <el-button type="primary" @click="openPmf">产品出入库</el-button>
      <el-button type="primary" @click="openMmf">原料出入库</el-button>
      <el-button type="primary" @click="openSmf">苗木出入库</el-button>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="props">
          <h3 style="margin-left: 11px;">{{ targets.find(i => i['value'] === props.row.target)?.label }}</h3>
          <el-table v-if="props.row.commodities.length" :data="props.row.commodities" border>
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="产品名称" align="center">
              <template #default="scope">
                <span>{{ scope.row.product ? scope.row.product.name : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品编号" align="center">
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
            <el-table-column label="消耗原料" align="center">
              <template #default="scope">
                <span>{{ scope.row.material ? scope.row.material.name : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="消耗数量" align="center">
              <template #default="scope">
                <span>{{ scope.row.materialQty ? scope.row.materialQty + scope.row.material?.unit?.name : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="定价(元)" prop="fixedPrice" align="center" />
          </el-table>
          <el-descriptions v-else :column="1" border>
            <el-descriptions-item label="名称" align="center" label-class-name="movement-desc-label">
              {{ props.row.material ? props.row.material.name : (props.row.sapling ? props.row.sapling.name : '-') }}
            </el-descriptions-item>
            <el-descriptions-item label="单位" align="center" label-class-name="movement-desc-label">
              {{ props.row.material ? props.row.material.unit.name : (props.row.sapling ? props.row.sapling.unit.name : '-') }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="时间" width="90" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出｜入" align="center">
        <template #default="scope">
          <span>{{ types.find(i => i['value'] === scope.row.type)?.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料类型" align="center">
        <template #default="scope">
          <span>{{ targets.find(i => i['value'] === scope.row.target)?.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定要删除该记录吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <ProductMovementForm
        v-if="pmfVisible"
        v-model="pmfVisible"
        :products="products"
        :materials="materials"
        @submit="onPmfSubmitted"
      />
    </template>
    <template #b>
      <MaterialMovementForm
        v-if="mmfVisible"
        v-model="mmfVisible"
        :materials="materials"
        @submit="onMmfSubmitted"
      />
    </template>
    <template #c>
      <SaplingMovementForm
        v-if="smfVisible"
        v-model="smfVisible"
        :saplings="saplings"
        @submit="onSmfSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import ProductMovementForm from './components/ProductMovementForm.vue'
import MaterialMovementForm from './components/MaterialMovementForm.vue'
import SaplingMovementForm from './components/SaplingMovementForm.vue'
import { getAllProducts } from '@/api/manufacture/product'
import { Product } from '@/api/manufacture/types/product'
import { getAllMaterials } from '@/api/manufacture/material'
import { Material } from '@/api/manufacture/types/material'
import { getAllSaplings } from '@/api/manufacture/sapling'
import { Sapling } from '@/api/manufacture/types/sapling'
import { getMovementsByConditions, deleteMovement } from '@/api/manufacture/movement'
import { Movement } from '@/api/manufacture/types/movement'
import moment from 'moment'
import { DECR, INCR, MATERIAL, PRODUCT, SAPLING } from '@/utils/constants'

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
    value: SAPLING
  }
]

onMounted(() => {
  loadAllProducts()
  loadAllMaterials()
  loadAllSaplings()
  loadMovements()
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
const saplings = ref<Sapling[]>([])
const loadAllSaplings = async () => {
  saplings.value = await getAllSaplings()
}

// 交易变动列表
const listParams = reactive({
  type: undefined,
  target: undefined,
  productId: undefined,
  materialId: undefined,
  saplingId: undefined,
  page: 1,
  size: 10
})
const movements = ref<Movement[]>([])
const count = ref(0)
const loadMovements = async () => {
  const data = await getMovementsByConditions(listParams)
  movements.value = data.results
  count.value = data.count
}

// 产品出入库
const pmfVisible = ref(false)
const openPmf = () => {
  pmfVisible.value = true
}

const onPmfSubmitted = () => {
  pmfVisible.value = false
  loadMovements()
}

// 原料出入库
const mmfVisible = ref(false)
const openMmf = () => {
  mmfVisible.value = true
}

const onMmfSubmitted = () => {
  mmfVisible.value = false
  loadMovements()
}

// 苗木出入库
const smfVisible = ref(false)
const openSmf = () => {
  smfVisible.value = true
}

const onSmfSubmitted = () => {
  smfVisible.value = false
  loadMovements()
}

const handleDelete = async (id: number) => {
  await deleteMovement(id)
  ElMessage.success('删除成功')
  loadMovements()
}

// 监听参数变化
watch(() => listParams.type, type => {
  listParams.type = !type ? undefined : type
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
watch(() => listParams.saplingId, id => {
  listParams.saplingId = !id ? undefined : id
})
</script>

<style lang="scss">
.movement-desc-label.el-descriptions__label {
  width: 20%;
}
</style>
