<template>
  <Index
    title="培育"
    :params="listParams"
    :count="count"
    :data="cultivations"
    :load="loadCultivations"
    :handler-btns="false"
  >
    <template #form-item>
      <el-form-item label="幼苗" prop="plantId">
        <el-select v-model="listParams.plantId" placeholder="请选择幼苗" clearable>
          <el-option v-for="(plant, i) in plants" :key="i" :label="plant.name" :value="plant.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="事件" prop="event" align="center" />
      <el-table-column label="幼苗" align="center">
        <template #default="scope">
          <span>{{ scope.row.plant.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template #default="scope">
          <el-image v-if="scope.row.srcList" style="width: 50px; height: 50px" fit="cover" :lazy="true" :src="scope.row.srcList[0]" :preview-src-list="scope.row.srcList" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定要删除该批幼苗吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </Index>
</template>

<script lang="ts" setup>
import { getCultivationsByConditions, deleteCultivation } from '@/api/nursery/cultivation'
import { Cultivation } from '@/api/nursery/types/cultivation'
import { getAllPlants } from '@/api/nursery/plant'
import { Plant } from '@/api/nursery/types/Plant'
import { downloadImage } from '@/api/file/image'

onMounted(() => {
  loadAllPlants()
  loadCultivations()
})

// 幼苗
const plants = ref<Plant[]>([])
const loadAllPlants = async () => {
  plants.value = await getAllPlants()
}

// 培育列表
const listParams = reactive({
  plantId: undefined,
  page: 1,
  size: 10
})

const cultivations = ref<Cultivation[]>([])
const count = ref(0)
const loadCultivations = async () => {
  const data = await getCultivationsByConditions(listParams)
  cultivations.value = data.results
  count.value = data.count
  // 图片处理
  cultivations.value.forEach(async item => {
    if (item.images && item.images.length) item.srcList = await downloadImage(item.images)
  })
}

const handleDelete = async (id: number) => {
  await deleteCultivation(id)
  ElMessage.success('删除成功')
  loadCultivations()
}

// 监听参数变化
watch(() => listParams.plantId, id => {
  listParams.plantId = !id ? undefined : id
})
</script>

<style lang="scss">
// .el-table .el-table__cell {
//   position: static;
// }
</style>
