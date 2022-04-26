<template>
  <el-dialog
    title="操作记录"
    v-model="visible"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="record-dialog-container"
    center
  >
    <!-- 基本信息 -->
    <el-descriptions :column="3" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">序列号</div>
        </template>
        {{ tree.serialNum }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">树木品种</div>
        </template>
        {{ tree.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">所属林场</div>
        </template>
        {{ tree.farm?.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">林场区域</div>
        </template>
        {{ tree.area?.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">种植时间</div>
        </template>
        {{ moment(tree.plantedAt).format('YYYY/MM') }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">最新状态</div>
        </template>
        <el-image style="width: 100px; height: 100px" fit="cover" :src="latestImgs[latestImgs.length-1]" :preview-src-list="latestImgs" />
      </el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <!-- 筛选表单 -->
    <el-form ref="form" :model="listParams" inline :disabled="store.state.isLoading" style="text-align: center">
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
    <el-table :data="records" style="width: 100%" v-loading="store.state.isLoading">
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
          <el-popover placement="bottom" trigger="hover" :show-after="300" @show="onImageShow(scope.row.images)">
            <el-image style="width: 150px" fit="cover" :src="srcList[0]" :preview-src-list="srcList" />
            <template #reference>
              <el-button type="text">查看</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadRecordsByConditions"
      :disabled="store.state.isLoading"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { getTreeById } from '@/api/forest/tree'
import { Tree } from '@/api/forest/types/tree'
import { getRecordsByConditions } from '@/api/forest/record'
import { Record } from '@/api/forest/types/record'
import { getAllOperTypes } from '@/api/forest/opertype'
import { OperType } from '@/api/forest/types/opertype'
import { getOperItemsByOperTypeId } from '@/api/forest/operitem'
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
  loadAllOpertypes()
  loadRecordsByConditions()
})

const listParams = reactive({
  treeId: props.id,
  operTypeId: undefined,
  operItemId: undefined,
  page: 1,
  size: 7
})

const tree: Tree = reactive({})
const loadTree = async () => {
  Object.assign(tree, await getTreeById(props.id))
}

// 操作项
const operTypes = ref<OperType[]>([])
const loadAllOpertypes = async () => {
  operTypes.value = await getAllOperTypes()
}

// 内容
const operItems = ref<OperItem[]>([])
const loadOperItemsByOperTypeId = async (id: number) => {
  operItems.value = await getOperItemsByOperTypeId(id)
}

// 记录列表
const records = ref<Record[]>([])
const count = ref(0)
const latestImgs = ref([])
const loadRecordsByConditions = async () => {
  const data = await getRecordsByConditions(listParams)
  records.value = data.results
  count.value = data.count

  // 首次加载获取最新图片
  if (!latestImgs.value.length) {
    const record = data.results.find(item => item.images && item.images.length)
    if (record) latestImgs.value = await downloadImage(record.images)
  }
}

// 图片处理
const srcList = ref([])
const onImageShow = async (images: string[]) => {
  srcList.value = await downloadImage(images)
}

watch(() => listParams.operTypeId, id => {
  listParams.operTypeId = !id ? undefined : id
  if (id) loadOperItemsByOperTypeId(id)
  loadRecordsByConditions()
})

watch(() => listParams.operItemId, id => {
  listParams.operItemId = !id ? undefined : id
  loadRecordsByConditions()
})

</script>

<style lang="scss">
.record-dialog-container {
  min-width: 900px;
}
</style>
