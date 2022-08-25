<template>
  <Dialog title="销售出库" :submit="handleSubmit">
    <el-form ref="form" :model="sale" :rules="rules" label-width="60px">
      <el-form-item label="客户" prop="customer">
        <el-input v-model="sale.customer" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="sale.remark" autosize placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="项目">
        <el-table :data="sale.goods" style="width: 100%" border>
          <el-table-column type="index" align="center" width="60">
            <template #header>
              <el-button type="primary" size="small" :icon="'Plus'" circle @click="handleAdd" />
            </template>
          </el-table-column>
          <el-table-column label="* 商品编号" align="center">
            <template #default="scope">
              <el-form-item>
                <el-input v-model="scope.row.serialNum" placeholder="请输入编号" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="售价(元)" align="center">
            <template #default="scope">
              <el-form-item>
                <el-input-number v-model="scope.row.salePrice" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="handleDelete(scope.$index)">删除</el-button>
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
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getCommoditiesBySerialNums } from '@/api/commerce/commodity'
import { createSale } from '@/api/commerce/sale'
import { SaleAttrs } from '@/api/commerce/types/sale'
import { validateQty } from '@/utils/validator'

// 表单验证
const rules = reactive({
  customer: [
    { required: true, message: '下单客户不能为空', trigger: 'blur' }
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

// 销售信息
const sale = reactive({
  customer: '',
  goods: [{
    serialNum: '',
    salePrice: 0
  }],
  quantity: 0,
  amount: 0,
  remark: ''
} as SaleAttrs)

const qty = computed(() => sale.goods.length)
const total = computed(() => sale.goods.reduce((sum, item) => Math.round((sum + item.salePrice + Number.EPSILON) * 100) / 100, 0))

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return

  sale.goods.forEach(item => {
    item.serialNum = item.serialNum.trim()
  })

  if (!sale.goods.length) {
    ElMessage.error('商品为必填项')
    return
  }

  if (sale.goods.some(item => item.serialNum === '')) {
    ElMessage.error('商品编号不能为空')
    return
  }

  const commodities = await getCommoditiesBySerialNums(sale.goods.map(item => item.serialNum))

  // 验证通过
  ElMessageBox({
    title: '请核对订单确认无误',
    message: h(
      'div',
      null,
      commodities.map(item => h('p', null, item.serialNum + ':' + item.product?.name)).concat(
        [
          h('p', null, '商品数量: ' + qty.value + ' 件'),
          h('p', null, '金额: ' + total.value + ' 元')
        ]
      )
    ),
    showCancelButton: true,
    confirmButtonText: '确认并提交',
    cancelButtonText: '取消'
  }).then(async () => {
    // 提交
    sale.quantity = qty.value
    sale.amount = total.value
    await createSale(sale)
    ElMessage.success('新增成功')
    emit('submit')
  })
}

const handleAdd = () => {
  sale.goods.push({
    serialNum: '',
    salePrice: 0
  })
}

const handleDelete = async (index: number) => {
  sale.goods.splice(index, 1)
}

</script>

<style lang="scss" scoped>
.el-table .el-form-item {
  margin-bottom: 0;
}
</style>
