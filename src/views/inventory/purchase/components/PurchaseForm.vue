<template>
  <Dialog
    title="新增采购"
    :submit="handleSubmit"
  >
    <el-form ref="form" :model="purchase" :rules="rules" label-width="100px">
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
        <el-input-number v-model="purchase.price" :min="0" :controls="false" :precision="2" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="purchase.quantity" :min="1" :controls="false" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="purchase.amount" disabled :controls="false" :precision="2" />
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input type="textarea" v-model="purchase.comment" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
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
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'change' }
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
const purchase = reactive({
  orderNum: '',
  productId: undefined as number | undefined,
  supplierId: undefined as number | undefined,
  price: 0,
  quantity: 1,
  amount: 0,
  comment: ''
})

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createPurchase(purchase)
  ElMessage.success('新增成功')
  emit('submit')
}

watch(() => [purchase.price, purchase.quantity], () => {
  purchase.amount = purchase.price! * purchase.quantity!
})
</script>
