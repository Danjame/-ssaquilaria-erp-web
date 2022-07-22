<template>
  <Dialog :title="id ? '编辑原料' : '新增原料'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="material" label-width="100px">
      <el-form-item label="原料名称" prop="name">
        <el-input v-model="material.name" placeholder="请输入原料名称" />
      </el-form-item>
      <el-form-item label="原料级别" prop="rankId">
        <el-select v-model="material.rankId" placeholder="请选择原料级别">
          <el-option v-for="(rank, i) in ranks" :key="i" :label="rank.name" :value="rank.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="unitId">
        <el-select v-model="material.unitId" placeholder="请选择单位">
          <el-option v-for="(unit, i) in units" :key="i" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="material.description" autosize placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="预警库存" prop="warnQty">
        <el-input-number v-model="material.warnQty" :min="0" :controls="false" placeholder="请输入预警数量" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { Rank } from '@/api/inventory/types/rank'
import { PropType } from 'vue'
import { getAllUnits } from '@/api/inventory/unit'
import { Unit } from '@/api/inventory/types/unit'
import { getMaterialById, createMaterial, updateMaterial } from '@/api/inventory/material'
import { MaterialAttrs } from '@/api/inventory/types/material'
import { validateQty } from '@/utils/validator'

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  ranks: {
    type: Array as PropType<Rank[]>,
    required: true
  }
})

const rules = reactive({
  name: [
    { required: true, message: '原料名称不能为空', trigger: 'change' }
  ],
  rankId: [
    { required: true, message: '原料级别不能为空', trigger: 'change' }
  ],
  unitId: [
    { required: true, message: '原料单位不能为空', trigger: 'change' }
  ],
  description: [
    { required: false, message: '描述不能为空', trigger: 'change' }
  ],
  warnQty: [
    { required: true, validator: validateQty, trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadMaterial()
  loadAllUnits()
})

// 单位
const units = ref<Unit[]>([])
const loadAllUnits = async () => {
  const results = await getAllUnits()
  units.value = results
}

// 原料信息
const material = reactive({} as MaterialAttrs)
const loadMaterial = async () => {
  const {
    name,
    rank: { id: rankId },
    unit: { id: unitId },
    description,
    warnQty
  } = await getMaterialById(props.id)

  Object.assign(material, {
    name,
    rankId,
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
    await createMaterial(material)
    ElMessage.success('新增成功')
  } else {
    await updateMaterial(props.id, material)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
