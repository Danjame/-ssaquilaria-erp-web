<template>
  <el-card>
    <template #header>
      <el-form ref="form" :model="listParams" inline :disabled="store.state.isLoading">
        <el-form-item label="树木品种" prop="name">
          <el-input v-model="listParams.name" placeholder="请输入品种" />
        </el-form-item>
        <el-form-item label="序列号" prop="serialNum">
          <el-input v-model="listParams.serialNum" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="所属林场" prop="farmId">
          <el-select v-model="listParams.farmId" placeholder="请选择林场" clearable>
            <el-option
              v-for="farm in farms"
              :key="farm.id"
              :label="farm.name"
              :value="farm.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="林场区域" prop="areaId">
          <el-select v-model="listParams.areaId" placeholder="请选择区域" clearable>
            <el-option
              v-for="area in areas"
              :key="area.id"
              :label="area.name"
              :value="area.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="loadTrees">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button-group>
        <el-button type="primary" :icon="'Plus'" @click="openForm">新增树木</el-button>
        <el-button type="primary" :icon="'Upload'" @click="uploadVisible = true">批量上传</el-button>
      </el-button-group>
    </template>
    <el-table :data="trees" style="width: 100%" v-loading="store.state.isLoading">
      <el-table-column label="序列号" prop="serialNum" align="center" />
      <el-table-column label="树木品种" prop="name" align="center" />
      <el-table-column label="所属林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林场分区" align="center">
        <template #default="scope">
          <span>{{ scope.row.area.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行" prop="positionX" align="center" />
      <el-table-column label="列" prop="positionY" align="center" />
      <el-table-column label="种植时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.plantedAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该树木吗?" @confirm="handleDelete(scope.row.id)">
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
      :load-list="loadTrees"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <TreeForm
    v-if="formVisible"
    v-model="formVisible"
    :id="treeId"
    :farms="farms"
    @submit="onFormSubmitted"
  />
  <TreeUpload
    v-if="uploadVisible"
    v-model="uploadVisible"
    @submit="onUploadSubmitted"
  />
</template>

<script lang="ts" setup>
import TreeForm from './components/TreeForm.vue'
import TreeUpload from './components/TreeUpload.vue'
import { getAllFarms } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'
import { getAreasByFarmId } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { getTreesByConditions, deleteTree } from '@/api/forest/tree'
import { Tree } from '@/api/forest/types/tree'
import store from '@/store'
import moment from 'moment'

onMounted(() => {
  loadAllFarms()
  loadTrees()
})

// 所属林场
const farms = ref<Farm[]>([])
const loadAllFarms = async () => {
  farms.value = await getAllFarms()
}

// 林场区域
const areas = ref<Area[]>([])
const loadAreasByFarmId = async (id: number) => {
  areas.value = await getAreasByFarmId(id)
}

// 树木列表
const listParams = reactive({
  serialNum: undefined,
  name: undefined,
  farmId: undefined,
  areaId: undefined,
  page: 1,
  size: 10
})
const trees = ref<Tree[]>([])
const count = ref(0)
const loadTrees = async () => {
  const data = await getTreesByConditions(listParams)
  trees.value = data.results
  count.value = data.count
}

const form = ref<typeof ElForm>()
const resetFields = (form: ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  loadTrees()
}

const handleDelete = async (id: number) => {
  await deleteTree(id)
  ElMessage.success('删除成功')
  loadTrees()
}

// 表格组件
const formVisible = ref(false)
const treeId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    treeId.value = payload
  } else {
    treeId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadTrees()
}

// 上传组件
const uploadVisible = ref(false)
const onUploadSubmitted = () => {
  console.log('sss')
  uploadVisible.value = false
  loadTrees()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.farmId, id => {
  listParams.farmId = !id ? undefined : id
  if (id) loadAreasByFarmId(id)
})
watch(() => listParams.areaId, id => {
  listParams.areaId = !id ? undefined : id
})
</script>
