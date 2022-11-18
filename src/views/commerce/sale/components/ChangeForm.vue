<template>
  <el-dialog
    title="变更"
    ref="dialog"
    v-model="visible"
    custom-class="change-dialog-container"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <el-descriptions title="订单信息" :column="1" border>
      <el-descriptions-item label-class-name="change-description-label" label="单号">
        {{ sale.orderNum }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="时间">
        {{ moment(sale.createdAt).format('YYYY/MM/DD HH:mm') }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="商品数量">
        {{ sale.quantity }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="金额(元)">
        {{ sale.amount }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="客户">
        <el-input style="width: 50%" v-model="sale.customer" placeholder="请输入客户名称" />
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="备注">
        <el-input type="textarea" autosize v-model="sale.remark" placeholder="请输入备注" />
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="退货">
        <el-form inline>
          <el-form-item label="退货商品">
            <el-select
              v-model="change.return"
              placeholder="请选择"
              multiple
              collapse-tags
              clearable
            >
              <el-option
                v-for="(commodity, i) in sale.commodities"
                :key="i"
                :label="commodity.serialNum + ': ' + commodity.product?.name + ' | ' + commodity.size + ' | ' + commodity.weight" :value="commodity.serialNum"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form inline>
          <template v-for="(p, i) in change.return" :key="i">
            <el-form-item :label="change.return[i]">
              {{ sale.commodities.find(item => item.serialNum === change.return[i])?.product?.name }} |
              {{ sale.commodities.find(item => item.serialNum === change.return[i])?.size }} |
              {{ sale.commodities.find(item => item.serialNum === change.return[i])?.weight }}
            </el-form-item>
            <el-form-item label="退款(元)">
              <el-input-number v-model="change.refund[i]" :min="0" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-form>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="补货">
        <el-form inline>
          <template v-for="(c, i) in leave" :key="i">
            <el-form-item>
              <el-input v-model="change.leave[i]" placeholder="请输入编号" @blur="onLeaveInputBlur(i)">
                <template #append>
                  <el-button :icon="'Close'" @click="handleDelete(i)" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="c.productName">
              {{ c.productName + ' | ' + c.size + ' | ' + c.weight }}
            </el-form-item>
            <el-form-item label="售价(元)">
              <el-input-number v-model="change.charge[i]" :min="0" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-form>
        <el-button @click="handleAdd">添加</el-button>
      </el-descriptions-item>
      <el-descriptions-item label-class-name="change-description-label" label="退/补(元)">{{ amount }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getSaleById, addChangeToSale } from '@/api/commerce/sale'
import { getCommodityBySerialNum } from '@/api/commerce/commodity'
import { ChangeAttrs } from '@/api/commerce/types/change'
import { Sale } from '@/api/commerce/types/sale'
import moment from 'moment'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const visible = false
const dialog = ref<typeof ElDialog>()

onMounted(() => {
  loadSale()
})

// 销售订单信息
const sale = reactive({} as Sale)
const loadSale = async () => {
  Object.assign(sale, await getSaleById(props.id))
}

const change = reactive({
  return: [],
  leave: [],
  refund: [],
  charge: [],
  amount: 0
} as ChangeAttrs)

const amount = computed(() => Math.round((change.charge.reduce((sum, item) => (sum + item), 0) - change.refund.reduce((sum, item) => (sum + item), 0) + Number.EPSILON) * 100) / 100)

const leave = ref<{ serialNum: string, productName: string, size: string, weight: string }[]>([])
const handleAdd = () => {
  leave.value.push({ serialNum: '', productName: '', size: '', weight: '' })
  change.leave.push('')
}
const handleDelete = (index: number) => {
  leave.value.splice(index, 1)
  change.leave.splice(index, 1)
}

const onLeaveInputBlur = (index: number) => {
  getCommodityBySerialNum(change.leave[index])
    .then(commodity => {
      const { product: { name: productName }, size, weight } = commodity
      leave.value[index].productName = productName
      leave.value[index].size = size
      leave.value[index].weight = weight
    })
    .catch(error => {
      console.log(error)
    })
}

// 表单提交
const isLoading = ref(false)
const emit = defineEmits(['submit'])

const handleSubmit = async () => {
  if (change.leave.length && change.leave.some(item => item === '')) return ElMessage.error('请输入补货商品编号')

  const unique: string[] = []
  const duplicate: string[] = []

  change.leave.forEach(item => {
    if (unique.indexOf(item) === -1) {
      unique.push(item)
    } else {
      duplicate.push(item)
    }
  })

  const list = [...new Set(duplicate)]
  if (list.length > 0) {
    return ElMessage.error(`商品编号${list}重复，请检查编号`)
  }

  ElMessageBox.confirm(
    '确定提交订单变更？',
    '订单变更'
  ).then(async () => {
    // 确认
    change.amount = amount.value
    isLoading.value = true

    const ret = await addChangeToSale(props.id, { change, customer: sale.customer, remark: sale.remark })
    if (ret) {
      ElMessage.success('操作成功')
      emit('submit')
    }
    isLoading.value = false
  })
}

const handleCancel = () => {
  dialog.value!.visible = false
}
</script>

<style lang="scss">
.change-dialog-container {
  min-width: 850px;

  .change-description-label {
    width: 100px;
    text-align: center !important;
  }
}
</style>
