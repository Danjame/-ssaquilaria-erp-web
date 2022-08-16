<template>
  <Dialog :title="id ? '编辑产品单位' : '新增产品单位'" :submit="handleSubmit">
    <el-form ref="form" :model="unit" :rules="rules" label-width="100px">
      <el-form-item label="单位名称" prop="name">
        <el-input v-model="unit.name" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="unit.remark" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createUnit, getUnitById, updateUnit } from '@/api/inventory/unit'
import { UnitAttrs } from '@/api/inventory/types/unit'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '单位名称不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadUnit()
})

// 单位信息
const unit = reactive({} as UnitAttrs)
const loadUnit = async () => {
  const { name, remark } = await getUnitById(props.id)
  Object.assign(unit, { name, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createUnit(unit)
    ElMessage.success('新增成功')
  } else {
    await updateUnit(props.id, unit)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
