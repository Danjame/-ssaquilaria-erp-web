<template>
  <Index
    title="苗木"
    :params="listParams"
    :count="count"
    :data="saplings"
    :load="loadSaplings"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="苗木名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入苗木名称" />
      </el-form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="listParams.farmId" placeholder="请选择林场" clearable>
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="林场区域" prop="areaId">
        <el-select v-model="listParams.areaId" placeholder="请选择区域" clearable>
          <el-option v-for="(area, i) in areas" :key="i" :label="area.name" :value="area.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="苗木名称" prop="name" align="center" />
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm ? scope.row.farm.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林区" align="center">
        <template #default="scope">
          <span>{{ scope.row.area ? scope.row.area.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stockQty" align="center" />
      <el-table-column label="入库数量" prop="incomingQty" align="center" />
      <el-table-column label="出库数量" prop="outgoingQty" align="center" />
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该苗木吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <SaplingForm
        v-if="formVisible"
        v-model="formVisible"
        :id="saplingId"
        :farms="farms"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import SaplingForm from './components/SaplingForm.vue'
import { getSaplingsByConditions, deleteSapling } from '@/api/manufacture/sapling'
import { Sapling } from '@/api/manufacture/types/sapling'
import { getAllFarms } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'
import { getAreasByFarm } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'

onMounted(() => {
  loadSaplings()
  loadAllFarms()
})

// 所属林场
const farms = ref<Farm[]>([])
const loadAllFarms = async () => {
  farms.value = await getAllFarms()
}

// 林场区域
const areas = ref<Area[]>([])
const loadAreasByFarm = async (id: number) => {
  areas.value = await getAreasByFarm(id)
}

// 苗木列表
const listParams = reactive({
  name: undefined,
  farmId: undefined,
  areaId: undefined,
  page: 1,
  size: 10
})
const saplings = ref<Sapling[]>([])
const count = ref(0)
const loadSaplings = async () => {
  const data = await getSaplingsByConditions(listParams)
  saplings.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const saplingId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    saplingId.value = payload
  } else {
    saplingId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadSaplings()
}

const handleDelete = async (id: number) => {
  await deleteSapling(id)
  ElMessage.success('删除成功')
  loadSaplings()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.farmId, id => {
  listParams.areaId = undefined
  areas.value = []
  listParams.farmId = !id ? undefined : id
  if (id) loadAreasByFarm(id)
})
watch(() => listParams.areaId, id => {
  listParams.areaId = !id ? undefined : id
})
</script>
