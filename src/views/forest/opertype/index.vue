<template>
  <Index
    title="记录类"
    :params="listParams"
    :count="count"
    :data="operTypes"
    :load="loadOperTypes"
    :handler-a="openForm"
    :filter="false"
  >
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="记录项" min-width="600" align="center">
        <template #default="scope">
          <span v-if="!scope.row.operItems.length">-</span>
          <el-space v-else>
            <el-tag v-for="(item, i) in scope.row.operItems" :key="i">{{ item.name }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该记录类吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <OperTypeForm
        v-if="formVisible"
        v-model="formVisible"
        :id="operTypeId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import OperTypeForm from './components/OperTypeForm.vue'
import { getOperTypesByConditions, deleteOperType } from '@/api/forest/operType'
import { OperType } from '@/api/forest/types/operType'

onMounted(() => {
  loadOperTypes()
})

// 记录类列表
const listParams = reactive({
  page: 1,
  size: 10
})
const operTypes = ref<OperType[]>([])
const count = ref(0)
const loadOperTypes = async () => {
  const data = await getOperTypesByConditions(listParams)
  operTypes.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const operTypeId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    operTypeId.value = payload
  } else {
    operTypeId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadOperTypes()
}

const handleDelete = async (id: number) => {
  await deleteOperType(id)
  ElMessage.success('删除成功')
  loadOperTypes()
}

</script>

<style lang="scss" scoped>

</style>
