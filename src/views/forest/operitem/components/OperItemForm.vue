<template>
  <Dialog :title="id ? '编辑记录项' : '新增记录项'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="operItem" label-width="100px">
      <el-form-item label="记录项名称" prop="name">
        <el-input v-model="operItem.name" placeholder="请输入记录项名称" />
      </el-form-item>
      <el-form-item label="记录类" prop="operTypeId">
        <el-select v-model="operItem.operTypeId" placeholder="请选择记录类">
          <el-option v-for="operType in operTypes" :key="operType.id" :label="operType.name" :value="operType.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="operItem.remark" placeholder="请输入备注" type="textarea" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { OperType } from '@/api/forest/types/opertype'
import { getOperItemById, createOperItem, updateOperItem } from '@/api/forest/operitem'

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  operTypes: {
    type: Array as PropType<OperType[]>,
    required: true
  }
})

const rules = reactive({
  name: [
    { required: true, message: '记录项名称不能为空', trigger: 'change' }
  ],
  operTypeId: [
    { required: true, message: '记录类不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadOperItem()
})

// 区域信息
const operItem = reactive({})
const loadOperItem = async () => {
  const {
    operType: { id: operTypeId },
    ...attrs
  } = await getOperItemById(props.id)

  Object.assign(operItem, { operTypeId, ...attrs })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createOperItem(operItem)
    ElMessage.success('新增成功')
  } else {
    await updateOperItem(props.id, operItem)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
