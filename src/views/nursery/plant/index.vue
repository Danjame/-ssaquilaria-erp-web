<template>
  <Index
    title="幼苗"
    :params="listParams"
    :count="count"
    :data="plants"
    :load="loadPlants"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="幼苗名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入幼苗名称" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="单位" prop="unit" align="center" />
      <el-table-column label="数量" prop="quantity" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该批幼苗吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <PlantForm
        v-if="formVisible"
        v-model="formVisible"
        :id="plantId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import PlantForm from './components/PlantForm.vue'
import { getPlantsByConditions, deletePlant } from '@/api/nursery/plant'
import { Plant } from '@/api/nursery/types/plant'

onMounted(() => {
  loadPlants()
})

// 幼苗列表
const listParams = reactive({
  name: undefined,
  page: 1,
  size: 10
})
const plants = ref<Plant[]>([])
const count = ref(0)
const loadPlants = async () => {
  const data = await getPlantsByConditions(listParams)
  plants.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const plantId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    plantId.value = payload
  } else {
    plantId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadPlants()
}

const handleDelete = async (id: number) => {
  await deletePlant(id)
  ElMessage.success('删除成功')
  loadPlants()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
</script>

<style lang="scss" scoped>

</style>
