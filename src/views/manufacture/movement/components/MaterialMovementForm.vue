<template>
  <Dialog title="原料出入库" :submit="handleSubmit">
    <el-form ref="form" :model="movement" :rules="rules" label-width="100px">
      <el-form-item prop="type">
        <el-radio-group v-model="movement.type">
          <el-radio-button :label="DECR">出库</el-radio-button>
          <el-radio-button :label="INCR">入库</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="原料" prop="materialId">
        <el-select v-model="movement.materialId" placeholder="请选择原料">
          <el-option v-for="(material, i) in materials" :key="i" :label="material.name + '(' + material.unit.name + ')'" :value="material.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="movement.quantity" :min="1" placeholder="请输入产品数量" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="movement.remark" autosize placeholder="请输入备注" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Material } from '@/api/manufacture/types/material'
import { createMaterialMovement } from '@/api/manufacture/movement'
import { MaterialMovementAttrs } from '@/api/manufacture/types/movement'
import { validateQty } from '@/utils/validator'
import { DECR, INCR, MATERIAL } from '@/utils/constants'

defineProps({
  materials: {
    type: Array as PropType<Material[]>,
    required: true
  }
})

// 表单验证
const rules = reactive({
  type: [
    { required: true, message: '出｜入库不能为空', trigger: 'blur' }
  ],
  materialId: [
    { required: true, message: '原料不能为空', trigger: 'blur' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'blur' }
  ]
})

// 变动信息
const movement = reactive({
  type: DECR,
  target: MATERIAL,
  materialId: undefined,
  quantity: 0,
  remark: ''
} as MaterialMovementAttrs)

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createMaterialMovement(movement)
  ElMessage.success('操作成功')
  emit('submit')
}

</script>

<style lang="scss">

</style>
