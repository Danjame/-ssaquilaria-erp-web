<template>
  <Dialog title="新增变动" :submit="handleSubmit">
    <el-form ref="form" :model="transaction" :rules="rules" label-width="100px">
      <el-form-item label="资产类型">
        <el-radio-group v-model="target">
          <el-radio-button :label="1">产品</el-radio-button>
          <el-radio-button :label="2">原料</el-radio-button>
          <el-radio-button :label="3">树苗</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="变动形式" prop="method">
        <el-select v-model="transaction.method" placeholder="请选择变动形式">
          <el-option v-for="(method, i) in methods" :key="i" :label="method.label" :value="method.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="变动类型" prop="type">
        <el-select v-model="transaction.type" placeholder="请选择变动类型">
          <el-option v-for="(type, i) in types" :key="i" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="target === 1" label="产品" prop="productId">
        <el-select v-model="transaction.productId" placeholder="请选择产品">
          <el-option v-for="(product, i) in products" :key="i" :label="product.name + '(' + product.unit.name + ')'" :value="product.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="target === 2" label="原料" prop="materialId">
        <el-select v-model="transaction.materialId" placeholder="请选择原料">
          <el-option v-for="(material, i) in materials" :key="i" :label="material.name + '(' + material.unit.name + ')'" :value="material.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="target === 3" label="树苗" prop="seedlingId">
        <el-select v-model="transaction.seedlingId" placeholder="请选择树苗">
          <el-option v-for="(seedling, i) in seedlings" :key="i" :label="seedling.name + '(' + seedling.unit.name + ')'" :value="seedling.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="transaction.quantity" :min="1" :controls="false" placeholder="请输入产品数量" />
      </el-form-item>
      <template v-if="target === 1 && transaction.type === INCR && transaction.method === PROD">
        <el-form-item label="重量" prop="weight">
          <el-input-number v-model="transaction.weight" :min="0" :controls="false" :precision="2" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item>
          <span>提示：产品生产入库将消耗对应原料。</span>
        </el-form-item>
      </template>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="transaction.remark" autosize placeholder="请输入备注" />
      </el-form-item>

    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Product } from '@/api/inventory/types/product'
import { Material } from '@/api/inventory/types/material'
import { Seedling } from '@/api/inventory/types/seedling'
import { createProductTransaction, createMaterialTransaction, createSeedlingTransaction } from '@/api/inventory/transaction'
import { TransactionAttrs } from '@/api/inventory/types/transaction'
import { validateQty } from '@/utils/validator'
import { DECR, INCR, PROD, TAR } from '@/utils/constants'

defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  },
  materials: {
    type: Array as PropType<Material[]>,
    required: true
  },
  seedlings: {
    type: Array as PropType<Seedling[]>,
    required: true
  }
})

const types = [
  {
    label: '入库',
    value: INCR
  },
  {
    label: '出库',
    value: DECR
  }
]

const methods = [
  {
    label: '生产',
    value: PROD
  },
  {
    label: '贸易',
    value: TAR
  }
]

const target = ref(1)

// 表单验证
const rules = reactive({
  method: [
    { required: true, message: '变动形式不能为空', trigger: 'change' }
  ],
  type: [
    { required: true, message: '变动类型不能为空', trigger: 'change' }
  ],
  target: [
    { required: true, message: '资产类型为必选项', trigger: 'change' }
  ],
  productId: [
    { required: true, message: '产品不能为空', trigger: 'change' }
  ],
  materialId: [
    { required: true, message: '原料不能为空', trigger: 'change' }
  ],
  seedlingId: [
    { required: true, message: '树苗不能为空', trigger: 'change' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'change' }
  ],
  weight: [
    { required: true, message: '重量不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

// 变动信息
const transaction = reactive({} as TransactionAttrs)

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  const { type, method, quantity, weight, productId, materialId, seedlingId, remark } = transaction
  switch (target.value) {
    case 1:
      await createProductTransaction({ type, method, quantity, weight, productId, remark })
      break
    case 2:
      await createMaterialTransaction({ type, method, quantity, materialId, remark })
      break
    case 3:
      await createSeedlingTransaction({ type, method, quantity, seedlingId, remark })
      break
  }
  ElMessage.success('新增成功')
  emit('submit')
}
</script>
