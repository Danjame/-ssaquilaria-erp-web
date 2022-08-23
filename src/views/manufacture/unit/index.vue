<template>
  <Index
    title="产品单位"
    :params="listParams"
    :count="count"
    :data="units"
    :load="loadUnits"
    :handler-a="openForm"
    :filter="false"
  >
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="单位名称" prop="name" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该单位吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <UnitForm
        v-if="formVisible"
        v-model="formVisible"
        :id="unitId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import UnitForm from './components/UnitForm.vue'
import { getUnitsByConditions, deleteUnit } from '@/api/manufacture/unit'
import { Unit } from '@/api/manufacture/types/unit'

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
  const data = await getUnitsByConditions(listParams)
  units.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const unitId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    unitId.value = payload
  } else {
    unitId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadUnits()
}

const handleDelete = async (id: number) => {
  await deleteUnit(id)
  ElMessage.success('删除成功')
  loadUnits()
}
</script>

<style lang="scss" scoped>

</style>
