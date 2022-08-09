<template>
  <Index
    title="区域"
    :params="listParams"
    :count="count"
    :data="areas"
    :load="loadAreas"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="listParams.farmId" placeholder="请选择林场" clearable>
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="区域名称" prop="name" align="center" />
      <el-table-column label="所属林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="树木数量" prop="treeCount" align="center" />
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该区域吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <AreaForm
        v-if="formVisible"
        v-model="formVisible"
        :id="areaId"
        :farms="farms"
        @submit="onFormSubmitted"
      />
    </template>
  </index>
</template>

<script lang="ts" setup>
import AreaForm from './components/AreaForm.vue'
import { getAreasByConditions, deleteArea } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { getAllFarms } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'

onMounted(() => {
  loadAllFarms()
  loadAreas()
})

// 林场
const farms = ref<Farm[]>([])
const loadAllFarms = async () => {
  farms.value = await getAllFarms()
}

// 区域列表
const listParams = reactive({
  farmId: undefined,
  page: 1,
  size: 10
})
const areas = ref<Area[]>([])
const count = ref(0)
const loadAreas = async () => {
  const data = await getAreasByConditions(listParams)
  areas.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const areaId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    areaId.value = payload
  } else {
    areaId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadAreas()
}

const handleDelete = async (id: number) => {
  await deleteArea(id)
  ElMessage.success('删除成功')
  loadAreas()
}

// 监听参数变化
watch(() => listParams.farmId, id => {
  listParams.farmId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>
