<template>
  <Dialog title="批量上传" :submit="handleSubmit">
    <el-upload
      style="text-align: center"
      ref="upload"
      drag
      :action="url"
      accept=".xlsx"
      :limit="limit"
      :headers="headers"
      :auto-upload="false"
      :on-exceed="onExceed"
      :on-error="onFail"
      :on-success="onSuccess"
    >
      <el-icon class="el-icon--upload">
        <component :is="'UploadFilled'" />
      </el-icon>
      <div class="el-upload__text">
        拖拽文件至此 或 <em>点击选择文件</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请上传 xlsx 格式的文件
        </div>
      </template>
    </el-upload>
  </Dialog>
</template>

<script lang="ts" setup>
import store from '@/store'

const url = `${import.meta.env.VITE_BASE_URL}/forest/trees/import`
const limit = 1
const headers = {
  Authorization: `Bearer ${store.state.user.token}`
}

const onExceed = () => {
  ElMessage.error(`只能上传${limit}个文件`)
}

const onFail = (error: Error) => {
  ElMessage.error(`上传失败: ${error.message}`)
}

const onSuccess = () => {
  ElMessage.success('上传成功')
}

const upload = ref<typeof ElUpload>()
const handleSubmit = () => {
  upload.value?.submit()
  return new Promise(resolve => resolve())
}

</script>
