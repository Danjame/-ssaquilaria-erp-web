<template>
  <el-dialog
    title="操作记录"
    custom-class="record-dialog-container"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <!-- 基本信息 -->
    <el-descriptions :column="3" border>
      <el-descriptions-item label="序列号" align="center">{{ tree.serialNum }}</el-descriptions-item>
      <el-descriptions-item label="树木品种" align="center">{{ tree.name }}</el-descriptions-item>
      <el-descriptions-item label="所属林场" align="center">{{ tree.farm?.name }}</el-descriptions-item>
      <el-descriptions-item label="林场区域" align="center">{{ tree.area?.name }}</el-descriptions-item>
      <el-descriptions-item label="种植时间" align="center">{{ moment(tree.plantedAt).format('YYYY/MM') }}</el-descriptions-item>
      <el-descriptions-item align="center">
        <template #label>
          <div class="cell-item">状态图{{ imgRecord.createdAt ? ' (' + moment(imgRecord.createdAt).format('YYYY/MM/DD') + ')' : '' }}</div>
        </template>
        <el-image style="width: 60px; height: 60px" fit="cover" :src="imgRecord.srcList[0]" :preview-src-list="imgRecord.srcList" />
      </el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <!-- 筛选表单 -->
    <el-form style="text-align: center" ref="form" inline :model="listParams" :disabled="store.state.isLoading">
      <el-form-item label="项目" prop="operType">
        <el-select v-model="listParams.operTypeId" placeholder="请选择项目" clearable>
          <el-option v-for="operType in operTypes" :key="operType.id" :label="operType.name" :value="operType.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="operItem">
        <el-select v-model="listParams.operItemId" placeholder="请选择内容" clearable>
          <el-option v-for="operItem in operItems" :key="operItem.id" :label="operItem.name" :value="operItem.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="records" v-loading="store.state.isLoading">
      <el-table-column label="时间" align="center" min-width="81">
        <template #default="scope">
          <span>{{ moment(scope.row.startedAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center">
        <template #default="scope">
          <span>{{ scope.row.operType?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template #default="scope">
          <span>{{ scope.row.operItem ? scope.row.operItem.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据" align="center">
        <template #default="scope">
          <span>{{ scope.row.operData ? scope.row.operData : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用时(分)" prop="duration" align="center" />
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span v-if="!scope.row.remark"> - </span>
          <el-popover v-else placement="bottom" trigger="hover" :content="scope.row.remark">
            <template #reference>
              <p style="overflow: hidden; white-space:nowrap; text-overflow:ellipsis">{{ scope.row.remark }}</p>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template #default="scope">
          <span>{{ scope.row.operator?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center">
        <template #default="scope">
          <span v-if="!scope.row.review"> - </span>
          <el-popover v-else placement="bottom" trigger="hover" :content="scope.row.review">
            <template #reference>
              <p style="overflow: hidden; white-space:nowrap; text-overflow:ellipsis">{{ scope.row.review }}</p>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center">
        <template #default="scope">
          <span>{{ scope.row.reviewer?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template #default="scope">
          <el-popover width="auto" placement="bottom" trigger="click" @show="onImageShow(scope.row.images)">
            <el-space>
              <el-image v-for="(img, index) in srcList" :key="index" style="width: 80px" fit="cover" :src="img" :preview-src-list="srcList" />
            </el-space>
            <template #reference>
              <el-button :icon="'Picture'" circle />
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadRecordsByTree"
      :disabled="store.state.isLoading"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { getTreeById } from '@/api/forest/tree'
import { Tree } from '@/api/forest/types/tree'
import { getRecordsByTree } from '@/api/forest/record'
import { Record } from '@/api/forest/types/record'
import { getAllOperTypes } from '@/api/forest/opertype'
import { OperType } from '@/api/forest/types/opertype'
import { getOperItemsByOperType } from '@/api/forest/operitem'
import { OperItem } from '@/api/forest/types/operitem'
import { downloadImage } from '@/api/file/image'
import store from '@/store'
import moment from 'moment'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

onMounted(() => {
  loadTree()
  loadImgRecord()
  loadAllOperTypes()
  loadRecordsByTree()
})

// 树木基本信息
const tree: Tree = reactive({})
const loadTree = async () => {
  Object.assign(tree, await getTreeById(props.id))
}

const imgRecord = reactive({
  srcList: [],
  createdAt: undefined
})
const loadImgRecord = async () => {
  const { results } = await getRecordsByTree({ treeId: props.id, operTypeId: 8 })
  const record = results.find(item => item.images && item.images.length)
  if (record) {
    imgRecord.srcList = await downloadImage(record.images)
    imgRecord.createdAt = record.createdAt
  }
}

// 操作项
const operTypes = ref<OperType[]>([])
const loadAllOperTypes = async () => {
  operTypes.value = await getAllOperTypes()
}

// 内容
const operItems = ref<OperItem[]>([])
const loadOperItemsByOperType = async (id: number) => {
  operItems.value = await getOperItemsByOperType(id)
}

// 记录列表
const listParams = reactive({
  treeId: props.id,
  operTypeId: undefined,
  operItemId: undefined,
  page: 1,
  size: 7
})
const records = ref<Record[]>([])
const count = ref(0)
const loadRecordsByTree = async () => {
  const data = await getRecordsByTree(listParams)
  records.value = data.results
  count.value = data.count
}

// 图片处理
const srcList = ref([])
const onImageShow = async (images: string[]) => {
  srcList.value = await downloadImage(images)
}

// 监听参数变化
watch(() => listParams.operTypeId, id => {
  listParams.operTypeId = !id ? undefined : id
  if (id) loadOperItemsByOperType(id)
  loadRecordsByTree()
})
watch(() => listParams.operItemId, id => {
  listParams.operItemId = !id ? undefined : id
  loadRecordsByTree()
})
</script>

<style lang="scss">
.record-dialog-container {
  min-width: 900px;
}
</style>
