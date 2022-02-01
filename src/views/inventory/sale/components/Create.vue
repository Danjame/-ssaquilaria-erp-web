<template>
  <el-form ref="form" :model="sale" :rules="rules" label-width="100px">
    <el-form-item label="采购单号" prop="orderNum">
      <el-input v-model="sale.orderNum" />
    </el-form-item>
    <el-form-item label="产品名称" prop="productId">
      <el-select v-model="sale.productId" placeholder="请选择产品名称" clearable>
        <el-option
          v-for="product in products"
          :key="product.id"
          :label="product.name"
          :value="product.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="客户编号" prop="customerId">
      <el-input-number v-model="sale.customerId" :controls="false" />
    </el-form-item>
    <el-form-item label="单价" prop="price">
      <el-input-number v-model="sale.price" :min="0" :controls="false" :precision="2" />
    </el-form-item>
    <el-form-item label="数量" prop="quantity">
      <el-input-number v-model="sale.quantity" :min="1" :controls="false" />
    </el-form-item>
    <el-form-item label="金额" prop="amount">
      <el-input-number v-model="sale.amount" disabled :controls="false" :precision="2" />
    </el-form-item>
    <el-form-item label="备注" prop="comment">
      <el-input type="textarea" v-model="sale.comment" autosize />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSumit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from 'vue'
import { Product } from '@/api/inventory/types/product'
import { createSale } from '@/api/inventory/sale'

defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  }
})

// 表单验证
const validateQty = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('请输入产品数量'))
  if (!Number.isInteger(value)) callback(new Error('产品数量必须为整数'))
  callback()
}
const rules = reactive({
  orderNum: [
    { required: true, message: '请输入采购单号', trigger: 'change' }
  ],
  productId: [
    { required: true, message: '请选择产品名称', trigger: 'change' }
  ],
  customerId: [
    { required: true, message: '请输入客户编号', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入产品单价', trigger: 'change' }
  ],
  quantity: [
    { validator: validateQty, trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入产品金额', trigger: 'change' }
  ],
  comment: [
    { required: false, message: '请输入备注', trigger: 'change' }
  ]
})

// 采购信息
const sale = reactive({
  orderNum: '',
  productId: undefined as number | undefined,
  customerId: undefined as number | undefined,
  price: 0,
  quantity: 1,
  amount: 0,
  comment: ''
})

// 表单提交
const form = ref<InstanceType<typeof ElForm> | null>(null)
const emit = defineEmits(['close'])
const handleSumit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createSale(sale)
  ElMessage.success('新增成功')
  emit('close')
}

watch(() => [sale.price, sale.quantity], () => {
  sale.amount = sale.price! * sale.quantity!
})
</script>
