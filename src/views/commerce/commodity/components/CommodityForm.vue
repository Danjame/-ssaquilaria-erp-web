<template>
  <Dialog title="编辑商品" :submit="handleSubmit">
    <el-form ref="form" :model="commodity" :rules="rules" label-width="100px">
      <el-form-item label="规格" prop="size">
        <el-input v-model="commodity.size" placeholder="请输入商品规格" />
      </el-form-item>
      <el-form-item label="重量" prop="weight">
        <el-input v-model="commodity.weight" placeholder="请输入商品重量" />
      </el-form-item>
      <el-form-item label="定价(元)" prop="fixedPrice">
        <el-input-number v-model="commodity.fixedPrice" :controls="false" placeholder="请输入商品定价" />
      </el-form-item>
      <el-form-item label="进价(元)" prop="purchasePrice">
        <el-input-number v-model="commodity.purchasePrice" :controls="false" placeholder="请输入采购价格" />
      </el-form-item>
      <el-form-item label="售价(元)" prop="salePrice">
        <el-input-number v-model="commodity.salePrice" :controls="false" placeholder="请输入销售价格" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getCommodityById, updateCommodity } from '@/api/commerce/commodity'
import { CommodityAttrs } from '@/api/commerce/types/commodity'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  size: [
    { required: true, message: '商品规格不能为空', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '商品重量不能为空', trigger: 'blur' }
  ],
  fixedPrice: [
    { required: false, message: '商品定价不能为空', trigger: 'blur' }
  ],
  purchasePrice: [
    { required: false, message: '采购价格不能为空', trigger: 'blur' }
  ],
  salePrice: [
    { required: false, message: '销售价格不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadCommodity()
})

// 客户信息
const commodity = reactive({} as CommodityAttrs)
const loadCommodity = async () => {
  Object.assign(commodity, await getCommodityById(props.id))
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (props.id) {
    await updateCommodity(props.id, commodity)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
