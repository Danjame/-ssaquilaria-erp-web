<template>
  <Dialog
    title="批量上传"
    :submit="handleSubmit"
  >
    <el-upload
      ref="upload"
      style="text-align: center"
      drag
      :action="url"
      accept=".xlsx"
      :headers="headers"
      :auto-upload="false"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onFail"
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

const headers = {
  Authorization: `Bearer ${store.state.user.token}`
}

const onRemove = () => {
  console.log('onRemove')
}
const onSuccess = () => {
  ElMessage.success('上传成功')
  emit('submit')
}
const onFail = () => {
  console.log('onFail')
}

const upload = ref<typeof ElUpload>()
const emit = defineEmits(['submit'])
const handleSubmit = () => {
  upload.value?.submit()
  return new Promise(resolve => resolve())
}

</script>
