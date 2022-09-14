<template>
  <el-dialog
    title="采购入库"
    ref="dialog"
    v-model="visible"
    custom-class="purchase-dialog-container"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <el-form ref="form" :model="purchase" :rules="rules" label-width="100px">
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="purchase.supplierId" placeholder="请选择供应商">
          <el-option v-for="(s, i) in suppliers" :key="i" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="入库商品">
        <el-table :data="purchase.goods" style="width: 100%" border>
          <el-table-column type="index" align="center" width="60">
            <template #header>
              <el-button type="primary" size="small" :icon="'Plus'" circle @click="addGoods" />
            </template>
          </el-table-column>
          <el-table-column label="产品" align="center">
            <template #default="scope">
              <el-form-item class="purchase-form-item">
                <el-select v-model="scope.row.productId" placeholder="请选择产品">
                  <el-option v-for="(p, i) in products" :key="i" :label="p.name" :value="p.id" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template #default="scope">
              <el-form-item class="purchase-form-item">
                <el-input v-model="scope.row.size" placeholder="请输入规格" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="重量" align="center">
            <template #default="scope">
              <el-form-item class="purchase-form-item">
                <el-input v-model="scope.row.weight" placeholder="请输入重量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="进价(元)" align="center">
            <template #default="scope">
              <el-form-item class="purchase-form-item">
                <el-input-number v-model="scope.row.purchasePrice" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template #default="scope">
              <el-form-item class="purchase-form-item">
                <el-input-number v-model="scope.row.quantity" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="deleteGoods(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number :model-value="qty" :controls="false" disabled />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number :model-value="total" :controls="false" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="purchase.remark" autosize placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
      </span>
    </template>
  </el-dialog>
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
  supplierId: [
    { required: true, message: '供应商不能为空', trigger: 'blur' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '金额不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'blur' }
  ]
})

// 采购信息
const purchase = reactive({
  goods: [{
    productId: undefined,
    size: '',
    weight: '',
    purchasePrice: 0,
    quantity: 1
  }],
  supplierId: undefined,
  quantity: 0,
  amount: 0,
  remark: ''
} as PurchaseAttrs)

const qty = computed(() => purchase.goods!.reduce((sum, item) => (sum + item.quantity), 0))
const total = computed(() => purchase.goods!.reduce((sum, item) => Math.round((sum + item.quantity * item.purchasePrice + Number.EPSILON) * 100) / 100, 0))

const addGoods = () => {
  purchase.goods?.push({
    productId: undefined,
    size: '',
    weight: '',
    purchasePrice: 0,
    quantity: 1
  })
}

const deleteGoods = async (index: number) => {
  purchase.goods?.splice(index, 1)
}

// 表单提交
const isLoading = ref(false)
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  purchase.quantity = qty.value
  purchase.amount = total.value

  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过

  ElMessageBox.confirm(
    '确定提交采购入库?',
    '采购入库'
  ).then(async () => {
    isLoading.value = true

    // 提交
    await createPurchase(purchase)
    ElMessage.success('新增成功')
    emit('submit')
  }).finally(() => {
    isLoading.value = false
  })
}

const visible = false
const dialog = ref<typeof ElDialog>()
const handleCancel = () => {
  dialog.value!.visible = false
}
</script>

<style lang="scss">
.purchase-dialog-container {
  min-width: 1200px;

  .purchase-form-item {
    display: inline-flex;
  }
}
</style>
