<template>
  <Dialog title="新增采购" :submit="handleSubmit">
    <el-form ref="form" :model="purchase" :rules="rules" label-width="100px">
      <el-form-item label="产品" prop="productId">
        <el-select v-model="purchase.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="purchase.supplierId" placeholder="请选择供应商" clearable>
          <el-option v-for="(supplier, i) in suppliers" :key="i" :label="supplier.name" :value="supplier.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input-number v-model="purchase.price" :min="0" :controls="false" :precision="2" placeholder="请输入产品单价" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="purchase.quantity" :min="1" :controls="false" placeholder="请输入产品数量" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="purchase.amount" disabled :controls="false" :precision="2" placeholder="请输入产品金额" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="purchase.remark" autosize placeholder="请输入备注" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Product } from '@/api/manufacture/types/product'
import { Supplier } from '@/api/commerce/types/supplier'
import { createPurchase } from '@/api/commerce/purchase'
import { PurchaseAttrs } from '@/api/commerce/types/purchase'
import { validateQty } from '@/utils/validator'

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
const rules = reactive({
  productId: [
    { required: true, message: '产品不能为空', trigger: 'blur' }
  ],
  supplierId: [
    { required: true, message: '供应商不能为空', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '产品单价不能为空', trigger: 'blur' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '产品金额不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'blur' }
  ]
})

// 采购信息
const purchase = reactive({} as PurchaseAttrs)

// 表单提交
const form = ref<typeof ElForm>()
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
