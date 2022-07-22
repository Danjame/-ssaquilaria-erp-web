<template>
  <Index
    title="树苗"
    :params="listParams"
    :count="count"
    :data="seedlings"
    :load="loadSeedlings"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="树苗名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入树苗名称" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="树苗名称" prop="name" align="center" />
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center" />
      <el-table-column label="供应商" align="center">
        <template #default="scope">
          <el-space>
            <el-tag v-for="(tag, i) in scope.row.suppliers.map((item: any) => item.name)" :key="i">{{ tag }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stockQty" align="center" />
      <el-table-column label="入库数量" prop="incomingQty" align="center" />
      <el-table-column label="出库数量" prop="outgoingQty" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该树苗吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <SeedlingForm
        v-if="formVisible"
        v-model="formVisible"
        :id="seedlingId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import SeedlingForm from './components/SeedlingForm.vue'
import { getSeedlingsByConditions, deleteSeedling } from '@/api/inventory/seedling'
import { Seedling } from '@/api/inventory/types/seedling'

onMounted(() => {
  loadSeedlings()
})

// 树苗列表
const listParams = reactive({
  name: undefined,
  page: 1,
  size: 10
})
const seedlings = ref<Seedling[]>([])
const count = ref(0)
const loadSeedlings = async () => {
  const data = await getSeedlingsByConditions(listParams)
  seedlings.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const seedlingId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    seedlingId.value = payload
  } else {
    seedlingId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadSeedlings()
}

const handleDelete = async (id: number) => {
  await deleteSeedling(id)
  ElMessage.success('删除成功')
  loadSeedlings()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
</script>
