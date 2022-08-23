<template>
  <Dialog title="苗木出入库" :submit="handleSubmit">
    <el-form ref="form" :model="movement" :rules="rules" label-width="100px">
      <el-form-item prop="type">
        <el-radio-group v-model="movement.type">
          <el-radio-button :label="DECR">出库</el-radio-button>
          <el-radio-button :label="INCR">入库</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="苗木" prop="saplingId">
        <el-select v-model="movement.saplingId" placeholder="请选择苗木">
          <el-option v-for="(sapling, i) in saplings" :key="i" :label="sapling.name + '(' + sapling.unit.name + ')'" :value="sapling.id" />
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
import { Sapling } from '@/api/manufacture/types/sapling'
import { createSaplingMovement } from '@/api/manufacture/movement'
import { SaplingMovementAttrs } from '@/api/manufacture/types/movement'
import { validateQty } from '@/utils/validator'
import { DECR, INCR, SAPLING } from '@/utils/constants'

defineProps({
  saplings: {
    type: Array as PropType<Sapling[]>,
    required: true
  }
})

// 表单验证
const rules = reactive({
  type: [
    { required: true, message: '出｜入库不能为空', trigger: 'blur' }
  ],
  saplingId: [
    { required: true, message: '苗木不能为空', trigger: 'blur' }
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
  target: SAPLING,
  saplingId: undefined,
  quantity: 0,
  remark: ''
} as SaplingMovementAttrs)

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createSaplingMovement(movement)
  ElMessage.success('操作成功')
  emit('submit')
}

</script>

<style lang="scss">

</style>
