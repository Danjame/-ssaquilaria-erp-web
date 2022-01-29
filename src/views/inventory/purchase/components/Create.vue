<template>
  <el-form ref="form" :rules="rules" :model="purchase" label-width="100px">
    <el-form-item label="采购单号" prop="orderNum">
      <el-input v-model="purchase.orderNum" />
    </el-form-item>
    <el-form-item label="产品名称" prop="productId">
      <el-select v-model="purchase.productId" placeholder="请选择产品名称" clearable>
        <el-option
          v-for="product in products"
          :key="product.id"
          :label="product.name"
          :value="product.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="供应商" prop="supplierId">
      <el-select v-model="purchase.supplierId" placeholder="请选择供应商" clearable>
        <el-option
          v-for="supplier in suppliers"
          :key="supplier.value"
          :label="supplier.label"
          :value="supplier.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="单价" prop="price">
      <el-input-number v-model="purchase.price" :min="0" />
    </el-form-item>
    <el-form-item label="数量" prop="quantity">
      <el-input v-model.number="purchase.quantity" :min="1" />
    </el-form-item>
    <el-form-item label="金额" prop="amount">
      <el-input v-model.number="purchase.amount" disabled />
    </el-form-item>
    <el-form-item label="备注" prop="comment">
      <el-input type="textarea" v-model="purchase.comment" autosize />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSumit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from 'vue'
import { Product } from '@/api/inventory/types/product'
import { Supplier } from '@/api/inventory/types/supplier'
import { createPurchase } from '@/api/inventory/purchase'

defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  },
  suppliers: {
    type: Array as PropType<Supplier[]>,
    required: true
  }
})

const rules = ref({
  orderNum: [
    { required: true, message: '请输入采购单号', trigger: 'change' }
  ],
  productId: [
    { required: true, message: '请选择产品名称', trigger: 'change' }
  ],
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入产品单价', trigger: 'change' },
    { type: 'number', message: '产品单价必须为数字' }
  ],
  quantity: [
    { required: true, message: '请输入产品数量', trigger: 'change' },
    { type: 'number', message: '产品数量必须为数字' }
  ],
  amount: [
    { required: true, message: '请输入产品金额', trigger: 'change' },
    { type: 'number', message: '产品金额必须为数字' }
  ],
  comment: [
    { required: false, message: '请输入备注', trigger: 'change' }
  ]
})

// 采购信息
const purchase = reactive({
  orderNum: '',
  productId: undefined as number | undefined,
  supplierId: undefined as number | undefined,
  price: undefined as number | undefined,
  quantity: undefined as number | undefined,
  amount: undefined as number | undefined,
  comment: ''
})

// 表单提交
const form = ref<InstanceType<typeof ElForm> | null>(null)
const emit = defineEmits(['close'])
const handleSumit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createPurchase(purchase)
  ElMessage.success('新增成功')
  emit('close')
}

watch(() => [purchase.price, purchase.quantity], () => {
  purchase.amount = purchase.price! * purchase.quantity!
})
</script>
