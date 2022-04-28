<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :model="listParams" :disabled="store.state.isLoading">
        <el-form-item label="所属林场" prop="farmId">
          <el-select v-model="listParams.farmId" placeholder="请选择林场" clearable>
            <el-option v-for="farm in farms" :key="farm.id" :label="farm.name" :value="farm.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="loadAreas">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增区域</el-button>
    </template>
    <el-table :data="areas" v-loading="store.state.isLoading">
      <el-table-column label="区域名称" prop="name" align="center" />
      <el-table-column label="所属林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="树木数量" prop="treeCount" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该区域吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadAreas"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <AreaForm
    v-if="formVisible"
    v-model="formVisible"
    :id="areaId"
    :farms="farms"
    @submit="onFormSubmitted"
  />
</template>

<script lang="ts" setup>
import AreaForm from './components/AreaForm.vue'
import { getAreasByConditions, deleteArea } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { getAllFarms } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'
import store from '@/store'

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

const form = ref<typeof ElForm>()
const resetFields = (form: ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  loadAreas()
}

// 新增与编辑组件
const formVisible = ref(false)
const areaId = ref(undefined as number | undefined)
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
