<template>
  <Dialog :title="id ? '编辑记录类' : '新增记录类'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="operType" label-width="100px">
      <el-form-item label="记录类名称" prop="name">
        <el-input v-model="operType.name" placeholder="请输入记录类名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="operType.remark" placeholder="请输入备注" type="textarea" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getOperTypeById, createOperType, updateOperType } from '@/api/forest/opertype'
import { OperType } from '@/api/forest/types/opertype'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const rules = reactive({
  name: [
    { required: true, message: '记录类名称不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadOperType()
})

// 记录类信息
const operType = reactive({} as OperType)
const loadOperType = async () => {
  const { name, remark } = await getOperTypeById(props.id)
  Object.assign(operType, { name, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createOperType(operType)
    ElMessage.success('新增成功')
  } else {
    await updateOperType(props.id, operType)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
