<template>
  <Index
    title="原料级别"
    :params="listParams"
    :count="count"
    :data="ranks"
    :load="loadRanks"
    :handler-a="openForm"
    :filter="false"
  >
    <template #table-column>
      <el-table-column label="级别名称" prop="name" align="center" />
      <el-table-column label="规格" align="center">
        <template #default="scope">
          <span>{{ scope.row.specification ? scope.row.specification : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该级别吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <RankForm
        v-if="formVisible"
        v-model="formVisible"
        :id="rankId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import RankForm from './components/RankForm.vue'
import { getRanksByConditions, deleteRank } from '@/api/inventory/rank'
import { Rank } from '@/api/inventory/types/rank'

onMounted(() => {
  loadRanks()
})

// 级别列表
const listParams = reactive({
  page: 1,
  size: 10
})
const ranks = ref<Rank[]>([])
const count = ref(0)
const loadRanks = async () => {
  const data = await getRanksByConditions(listParams)
  ranks.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const rankId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    rankId.value = payload
  } else {
    rankId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadRanks()
}

const handleDelete = async (id: number) => {
  await deleteRank(id)
  ElMessage.success('删除成功')
  loadRanks()
}
</script>

<style lang="scss" scoped>

</style>
