<template>
  <Index
    title="原料"
    :params="listParams"
    :count="count"
    :data="materials"
    :load="loadMaterials"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="原料名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="原料级别" prop="rankId">
        <el-select v-model="listParams.rankId" placeholder="请选择原料级别" clearable>
          <el-option v-for="(rank, i) in ranks" :key="i" :label="rank.name" :value="rank.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="原料名称" prop="name" align="center" />
      <el-table-column label="原料级别" align="center">
        <template #default="scope">
          <span>{{ scope.row.rank.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center">
        <template #default="scope">
          <el-space v-if="scope.row.suppliers && scope.row.suppliers.length > 0">
            <el-tag v-for="(tag, i) in scope.row.suppliers?.map((item: any) => item.name)" :key="i">{{ tag }}</el-tag>
          </el-space>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stockQty" align="center" />
      <el-table-column label="入库数量" prop="incomingQty" align="center" />
      <el-table-column label="出库数量" prop="outgoingQty" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该原料吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <MaterialForm
        v-if="formVisible"
        v-model="formVisible"
        :id="materialId"
        :ranks="ranks"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import MaterialForm from './components/MaterialForm.vue'
import { getAllRanks } from '@/api/inventory/rank'
import { Rank } from '@/api/inventory/types/rank'
import { getMaterialsByConditions, deleteMaterial } from '@/api/inventory/material'
import { Material } from '@/api/inventory/types/material'

onMounted(() => {
  loadAllRanks()
  loadMaterials()
})

// 原料级别
const ranks = ref<Rank[]>([])
const loadAllRanks = async () => {
  ranks.value = await getAllRanks()
}

// 原料列表
const listParams = reactive({
  name: undefined,
  rankId: undefined,
  page: 1,
  size: 10
})
const materials = ref<Material[]>([])
const count = ref(0)
const loadMaterials = async () => {
  const data = await getMaterialsByConditions(listParams)
  materials.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const materialId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    materialId.value = payload
  } else {
    materialId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadMaterials()
}

const handleDelete = async (id: number) => {
  await deleteMaterial(id)
  ElMessage.success('删除成功')
  loadMaterials()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.rankId, id => {
  listParams.rankId = !id ? undefined : id
})
</script>
