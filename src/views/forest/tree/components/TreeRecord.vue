<template>
  <el-dialog
    title="操作记录"
    custom-class="record-dialog-container"
    destroy-on-close
    :model-value="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <!-- 基本信息 -->
    <el-descriptions :column="3" border>
      <el-descriptions-item label="树木编号" align="center">{{ tree.serialNum }}</el-descriptions-item>
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
    <el-form ref="form" inline :model="listParams" :disabled="store.state.isLoading">
      <el-form-item label="记录类" prop="operType">
        <el-select v-model="listParams.operTypeId" placeholder="请选择记录类" clearable class="record-form-select">
          <el-option v-for="(operType, i) in operTypes" :key="i" :label="operType.name" :value="operType.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="记录项" prop="operItem">
        <el-select v-model="listParams.operItemId" placeholder="请选择记录项" clearable class="record-form-select">
          <el-option v-for="(operItem, i) in operItems" :key="i" :label="operItem.name" :value="operItem.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人" prop="operatorId">
        <el-select v-model="listParams.operatorId" placeholder="请选择操作人" clearable class="record-form-select">
          <el-option v-for="(user, i) in users" :key="i" :label="user.name" :value="user.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="reviewerId">
        <el-select v-model="listParams.reviewerId" placeholder="请选择审核人" clearable class="record-form-select">
          <el-option v-for="(user, i) in users" :key="i" :label="user.name" :value="user.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="records" v-loading="store.state.isLoading">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="时间" align="center" min-width="81">
        <template #default="scope">
          <span>{{ moment(scope.row.startedAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录类" align="center">
        <template #default="scope">
          <span>{{ scope.row.operType?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录项" align="center">
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
      <el-table-column class-name="record-picture-table-column" label="图片" align="center">
        <template #default="scope">
          <el-image
            style="width: 50px; height: 50px;"
            fit="cover"
            :src="scope.row.srcList && scope.row.srcList.length ? scope.row.srcList[0] : null"
            :preview-src-list="scope.row.srcList"
          >
            <template #placeholder>
              <div class="image-slot">
                <el-icon><component :is="'Picture'" /></el-icon>
              </div>
            </template>
            <template #error>
              <div class="image-slot">
                <el-icon><component :is="'DocumentDelete'" /></el-icon>
              </div>
            </template>
          </el-image>
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
import { getAllUsers } from '@/api/system/user'
import { User } from '@/api/system/types/user'
import { downloadImage } from '@/api/file/image'
import store from '@/store'
import moment from 'moment'

const props = defineProps({
  id: {
    type: Number,
    required: true,
    default: null
  }
})

onMounted(() => {
  loadTree()
  loadImgRecord()
  loadAllOperTypes()
  loadAllUsers()
  loadRecordsByTree()
})

// 树木基本信息
const tree = reactive({} as Tree)
const loadTree = async () => {
  Object.assign(tree, await getTreeById(props.id))
}

const imgRecord = reactive({
  srcList: [] as string[],
  createdAt: undefined as Date | undefined
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

// 记录项
const operItems = ref<OperItem[]>([])
const loadOperItemsByOperType = async (id: number) => {
  operItems.value = await getOperItemsByOperType(id)
}

// 操作人/审核人
const users = ref<User[]>([])
const loadAllUsers = async () => {
  users.value = await getAllUsers()
}

// 记录列表
const listParams = reactive({
  treeId: props.id,
  operTypeId: undefined,
  operItemId: undefined,
  operatorId: undefined,
  reviewerId: undefined,
  page: 1,
  size: 7
})
const records = ref<Record[]>([])
const count = ref(0)
const loadRecordsByTree = async () => {
  const data = await getRecordsByTree(listParams)
  records.value = data.results
  count.value = data.count

  records.value.forEach(async item => {
    if (item.images && item.images.length) item.srcList = await downloadImage(item.images)
  })
}

// 监听参数变化
watch(() => listParams.operTypeId, id => {
  listParams.operItemId = undefined
  operItems.value = []
  listParams.operTypeId = !id ? undefined : id
  if (id) loadOperItemsByOperType(id)
  loadRecordsByTree()
})
watch(() => listParams.operItemId, id => {
  listParams.operItemId = !id ? undefined : id
  loadRecordsByTree()
})
watch(() => listParams.operatorId, id => {
  listParams.operatorId = !id ? undefined : id
  loadRecordsByTree()
})
watch(() => listParams.reviewerId, id => {
  listParams.reviewerId = !id ? undefined : id
  loadRecordsByTree()
})
</script>

<style lang="scss">
.record-dialog-container {
  min-width: 1000px;

  .record-form-select {
    width: 150px;
  }

  .el-table .el-table__cell {
    position: static;
  }

  .el-table__body-wrapper .record-picture-table-column .cell {
    line-height: 0px;

    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }
}
</style>
