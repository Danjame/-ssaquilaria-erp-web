<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增产品单位</el-button>
    </template>
    <el-table :data="units" style="width: 100%">
      <el-table-column label="单位名称" prop="name" align="center" />
      <el-table-column label="值" prop="value" align="center" />
      <el-table-column label="单位标签" prop="label" align="center" />
      <el-table-column label="描述" prop="description" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm
              title="确定要删除该产品单位吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      align="right"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <UnitForm
    v-if="visible"
    v-model="visible"
    :id="unitId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import UnitForm from './components/UnitForm.vue'
import { getUnitsByConditions, deleteUnit } from '@/api/inventory/unit'
import { Unit } from '@/api/inventory/types/unit'

onMounted(() => {
  loadUnits()
})

// 类别列表
const listParams = reactive({
  page: 1,
  size: 10
})
const units = ref<Unit[]>([])
const count = ref(0)
const loadUnits = async () => {
  const { results, total } = await getUnitsByConditions(listParams)
  units.value = results
  count.value = total
}

// 显示隐藏 form
const visible = ref(false)
const unitId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    unitId.value = payload
  } else {
    unitId.value = undefined
  }
  visible.value = true
}

const onSubmitted = () => {
  visible.value = false
  loadUnits()
}

const handleDelete = async (id: number) => {
  await deleteUnit(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadUnits()
})
</script>

<style lang="scss" scoped>

</style>
