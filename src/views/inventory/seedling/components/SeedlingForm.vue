<template>
  <Dialog :title="id ? '编辑苗木' : '新增苗木'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="seedling" label-width="100px">
      <el-form-item label="苗木名称" prop="name">
        <el-input v-model="seedling.name" placeholder="请输入苗木名称" />
      </el-form-item>
      <el-form-item label="单位" prop="unitId">
        <el-select v-model="seedling.unitId" placeholder="请选择单位">
          <el-option v-for="(unit, i) in units" :key="i" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="seedling.description" autosize placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="预警库存" prop="warnQty">
        <el-input-number v-model="seedling.warnQty" :min="0" :controls="false" placeholder="请输入预警数量" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllUnits } from '@/api/inventory/unit'
import { Unit } from '@/api/inventory/types/unit'
import { getSeedlingById, createSeedling, updateSeedling } from '@/api/inventory/seedling'
import { SeedlingAttrs } from '@/api/inventory/types/seedling'
import { validateQty } from '@/utils/validator'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const rules = reactive({
  name: [
    { required: true, message: '苗木名称不能为空', trigger: 'blur' }
  ],
  unitId: [
    { required: true, message: '苗木单位不能为空', trigger: 'blur' }
  ],
  description: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ],
  warnQty: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadSeedling()
  loadAllUnits()
})

// 单位
const units = ref<Unit[]>([])
const loadAllUnits = async () => {
  const results = await getAllUnits()
  units.value = results
}

// 苗木信息
const seedling = reactive({} as SeedlingAttrs)
const loadSeedling = async () => {
  const {
    name,
    unit: { id: unitId },
    description,
    warnQty
  } = await getSeedlingById(props.id)

  Object.assign(seedling, {
    name,
    unitId,
    description,
    warnQty
  })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createSeedling(seedling)
    ElMessage.success('新增成功')
  } else {
    await updateSeedling(props.id, seedling)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
