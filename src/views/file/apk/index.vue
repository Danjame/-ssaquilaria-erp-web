<template>
  <Index
    title="终端版本"
    :params="listParams"
    :count="count"
    :data="apks"
    :load="loadApks"
    :handler-a="() => {formVisible = true }"
  >
    <template #form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="listParams.version" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="强制更新" prop="needUpdate">
        <el-select v-model="listParams.needUpdate" placeholder="是否强制更新" clearable>
          <el-option v-for="(item, i) in status" :key="i" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="版本号" prop="version" align="center" />
      <el-table-column label="上传时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="originalName" align="center" />
      <el-table-column label="强制更新" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.needUpdate" type="success">是</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button v-if="!scope.row.isDownLoading" type="primary" link @click="handleDownload(scope.row)">下载</el-button>
          <span v-else>
            <el-button type="primary" link @click="handleCancel(scope.row)">取消</el-button>
            <el-progress
              type="line"
              :stroke-width="1"
              :text-inside="true"
              :percentage="scope.row.loadedPercentage"
              @click="handleCancel(scope.row)"
            />
          </span>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <ApkForm
        v-if="formVisible"
        v-model="formVisible"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import ApkForm from './components/ApkForm.vue'
import { downloadApk, getApksByConditions } from '@/api/file/apk'
import { Apk } from '@/api/file/types/apk'
import moment from 'moment'
import axios from 'axios'

onMounted(() => {
  loadApks()
})

// 状态
const status = [
  {
    name: '是',
    value: 1
  },
  {
    name: '否',
    value: 0
  }
]

// 软件列表
const listParams = reactive({
  version: undefined,
  needUpdate: undefined,
  page: 1,
  size: 10
})
const apks = ref<Apk[]>([])
const count = ref(0)
const loadApks = async () => {
  const data = await getApksByConditions(listParams)
  apks.value = data.results
  apks.value.forEach(apk => {
    Object.assign(apk, {
      isDownLoading: false,
      loadedPercentage: 0,
      cancelDownload: Function
    })
  })
  count.value = data.count
}

// 新增组件
const formVisible = ref(false)
const onFormSubmitted = () => {
  formVisible.value = false
  loadApks()
}

const handleDownload = (row: Apk) => {
  downloadApk(row.fileNum, row.fileName, progress => {
    row.isDownLoading = true
    row.loadedPercentage = Math.floor(progress.loaded / progress.total * 100)
  }, new axios.CancelToken(executor => {
    row.cancelDownload = executor
  })).then(() => {
    row.isDownLoading = false
    row.loadedPercentage = 0
    ElMessage.success(`已下载 ${row.fileName} 文件`)
  }).catch(error => {
    if (axios.isCancel(error)) {
      ElMessage.warning(`已取消 ${row.fileName} 下载`)
    }
  })
}

const handleCancel = (row: Apk) => {
  row.cancelDownload()
  row.isDownLoading = false
  row.loadedPercentage = 0
}

// 监听参数变化
watch(() => listParams.version, v => {
  listParams.version = !v ? undefined : v
})
watch(() => listParams.needUpdate, value => {
  listParams.needUpdate = value === '' ? undefined : value
})
</script>

<style lang="scss" scoped>
</style>
