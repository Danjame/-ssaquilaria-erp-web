<template>
  <Dialog title="编辑客户" :submit="handleSubmit">
    <el-form ref="form" :model="client" :rules="rules" label-width="100px">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="client.name" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="client.phone" placeholder="请输入手机号" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getClientById, updateClient } from '@/api/commerce/client'
import { ClientAttrs } from '@/api/commerce/types/client'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '客户名称不能为空', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadClient()
})

// 客户信息
const client = reactive({} as ClientAttrs)
const loadClient = async () => {
  const { name, phone } = await getClientById(props.id)
  Object.assign(client, { name, phone })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (props.id) {
    await updateClient(props.id, client)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
