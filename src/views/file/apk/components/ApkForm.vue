<template>
  <Dialog title="上传新版本" :submit="handleSubmit">
    <div style="text-align: center;">
      <el-space direction="vertical">
        <el-upload
          style="text-align: center"
          ref="upload"
          accept=".apk"
          drag
          :action="url"
          :data="apk"
          :limit="limit"
          :headers="headers"
          :auto-upload="false"
          :on-exceed="onExceed"
          :on-error="onFail"
          :on-success="onSuccess"
          :on-change="onChange"
          :on-remove="onRemove"
        >
          <el-icon class="el-icon--upload">
            <component :is="'UploadFilled'" />
          </el-icon>
          <div class="el-upload__text">
            拖拽文件至此 或 <em>点击选择文件</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传 apk 格式的文件
            </div>
          </template>
        </el-upload>
        <el-form ref="form" :rules="rules" :model="apk">
          <el-form-item label="版本" prop="version">
            <el-input v-model="apk.version" placeholder="请输入版本号" />
          </el-form-item>
          <el-form-item label="更新" prop="needUpdate">
            <el-select v-model="apk.needUpdate" placeholder="是否强制更新" clearable>
              <el-option v-for="(item, i) in status" :key="i" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-space>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import store from '@/store'

const rules = reactive({
  version: [
    { required: true, message: '版本号不能为空', trigger: 'blur' }
  ],
  needUpdate: [
    { required: true, message: '请选择是否强制更新', trigger: 'blur' }
  ]
})

// 状态
const status = [
  {
    name: '是',
    value: true
  },
  {
    name: '否',
    value: false
  }
]

const url = `${import.meta.env.VITE_BASE_URL}/file/apks/upload`
const apk = reactive({
  version: undefined,
  needUpdate: undefined
})
const limit = 1
const headers = {
  Authorization: `Bearer ${store.state.user?.token}`
}

const onExceed = () => {
  ElMessage.error(`只能上传${limit}个文件`)
}
const onFail = (error: Error) => {
  ElMessage.error(`上传失败: ${error.message}`)
}
const hasFile = ref(false)
const onChange = () => {
  hasFile.value = true
}
const onRemove = () => {
  hasFile.value = false
}

const emit = defineEmits(['submit'])
const onSuccess = () => {
  ElMessage.success('上传成功')
  emit('submit')
}

// 表单提交
const form = ref<typeof ElForm>()
const upload = ref<typeof ElUpload>()

const handleSubmit = async () => {
  if (!hasFile.value) ElMessage.error('请选择文件上传')

  const valid = await form.value?.validate()
  if (!valid) return

  // 验证通过
  upload.value?.submit()
}

</script>
