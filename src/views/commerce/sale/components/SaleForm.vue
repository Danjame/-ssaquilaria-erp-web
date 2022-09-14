<template>
  <el-dialog
    title="销售出库"
    ref="dialog"
    v-model="visible"
    custom-class="sale-dialog-container"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
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
              <el-form-item class="sale-form-item">
                <el-input v-model="scope.row.serialNum" placeholder="请输入编号" @blur="onBlur(scope.row)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="规格" prop="size" align="center" />
          <el-table-column label="重量" prop="weight" align="center" />
          <el-table-column label="售价(元)" align="center">
            <template #default="scope">
              <el-form-item class="sale-form-item">
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
    <template #footer>
      <span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getCommoditiesBySerialNums, getCommodityBySerialNum } from '@/api/commerce/commodity'
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
    salePrice: 0,
    name: '',
    size: '',
    weight: ''
  }],
  quantity: 0,
  amount: 0,
  remark: ''
} as SaleAttrs)

const qty = computed(() => sale.goods.length)
const total = computed(() => sale.goods.reduce((sum, item) => Math.round((sum + item.salePrice + Number.EPSILON) * 100) / 100, 0))

const handleAdd = () => {
  sale.goods.push({
    serialNum: '',
    salePrice: 0,
    name: '',
    size: '',
    weight: ''
  })
}

const handleDelete = async (index: number) => {
  sale.goods.splice(index, 1)
}

const onBlur = async (article: {
  serialNum: string;
  salePrice: number;
  name: string;
  size: string;
  weight: string;
  }) => {
  if (!article.serialNum) return ElMessage.warning('商品编号不能为空')

  const list = sale.goods.map(item => item.serialNum)
  const set = new Set(list)

  if (list.length !== set.size) {
    ElMessage.warning(`编号 ${article.serialNum}已存在, 请勿重复输入`)
  } else {
    const commodity = await getCommodityBySerialNum(article.serialNum)
    if (commodity) {
      const { product: { name: productName }, size, weight } = commodity
      article.name = productName
      article.size = size
      article.weight = weight
    }
  }
}

// 表单提交
const isLoading = ref(false)
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return

  sale.goods.forEach(item => {
    item.serialNum = item.serialNum.trim()
  })

  if (!sale.goods.length) return ElMessage.error('商品为必填项')

  if (sale.goods.some(item => item.serialNum === '')) return ElMessage.error('商品编号不能为空')

  const commodities = await getCommoditiesBySerialNums(sale.goods.map(item => item.serialNum))
  if (!commodities) return ElMessage.error('请输入正确的商品编号')

  // 验证通过
  ElMessageBox({
    title: '请核对订单确认无误',
    message: h(
      'div',
      null,
      commodities?.map(item => h('p', null, item.serialNum + ':' + item.product?.name)).concat(
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
    isLoading.value = true

    // 提交
    sale.quantity = qty.value
    sale.amount = total.value
    const ret = await createSale(sale)
    if (ret) {
      ElMessage.success('操作成功')
      emit('submit')
    }
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
.sale-dialog-container {
  min-width: 1110px;

  .sale-form-item {
    display: inline-flex;
  }
}
</style>
