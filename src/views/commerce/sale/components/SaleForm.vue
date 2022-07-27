<template>
  <Dialog title="新增销售" :submit="handleSubmit">
    <el-form ref="form" :model="sale" :rules="rules" label-width="100px">
      <el-form-item label="销售单号" prop="orderNum">
        <el-input v-model="sale.orderNum" placeholder="请输入销售单号" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productId">
        <el-select v-model="sale.productId" placeholder="请选择产品名称" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户编号" prop="customerId">
        <el-input-number v-model="sale.customerId" :controls="false" placeholder="请输入客户编号" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input-number v-model="sale.price" :min="0" :controls="false" :precision="2" placeholder="请输入产品单价" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="sale.quantity" :min="1" :controls="false" placeholder="请输入产品数量" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="sale.amount" disabled :controls="false" :precision="2" placeholder="请输入产品金额" />
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input type="textarea" v-model="sale.comment" autosize placeholder="请输入备注" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Product } from '@/api/inventory/types/product'
import { createSale } from '@/api/commerce/sale'
import { SaleAttrs } from '@/api/commerce/types/sale'
import { validateQty } from '@/utils/validator'

defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  }
})

// 表单验证
const rules = reactive({
  orderNum: [
    { required: true, message: '销售单号不能为空', trigger: 'change' }
  ],
  productId: [
    { required: true, message: '产品名称不能为空', trigger: 'change' }
  ],
  customerId: [
    { required: true, message: '客户编号不能为空', trigger: 'change' }
  ],
  price: [
    { required: true, message: '产品单价不能为空', trigger: 'change' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'change' }
  ],
  amount: [
    { required: true, message: '产品金额不能为空', trigger: 'change' }
  ],
  comment: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

// 销售信息
const sale = reactive({} as SaleAttrs)

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  await createSale(sale)
  ElMessage.success('新增成功')
  emit('submit')
}

watch(() => [sale.price, sale.quantity], () => {
  sale.amount = sale.price! * sale.quantity!
})
</script>
