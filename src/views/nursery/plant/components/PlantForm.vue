<template>
  <Dialog :title="id ? '编辑幼苗' : '新增幼苗'" :submit="handleSubmit">
    <el-form ref="form" :model="plant" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="plant.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="plant.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="plant.quantity" :min="1" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="plant.remark" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createPlant, getPlantById, updatePlant } from '@/api/nursery/plant'
import { PlantAttrs } from '@/api/nursery/types/plant'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '单位不能为空', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '数量不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadPlant()
})

// 单位信息
const plant = reactive({} as PlantAttrs)
const loadPlant = async () => {
  const { name, unit, quantity, remark } = await getPlantById(props.id)
  Object.assign(plant, { name, unit, quantity, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createPlant(plant)
    ElMessage.success('新增成功')
  } else {
    await updatePlant(props.id, plant)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
