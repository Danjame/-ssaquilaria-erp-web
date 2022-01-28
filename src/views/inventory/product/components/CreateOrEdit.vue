<template>
  <el-form ref="form" :rules="rules" :model="product" label-width="100px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="product.name" />
    </el-form-item>
    <el-form-item label="类别" prop="categoryId">
      <el-select v-model="product.categoryId" placeholder="请选择产品类别">
        <el-option
          v-for="category in categories"
          :key="category.value"
          :label="category.label"
          :value="category.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="单位" prop="unitId">
      <el-select v-model="product.unitId" placeholder="请选择产品单位">
        <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="规格" prop="sieze">
      <el-input v-model="product.size" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="product.description" autosize />
    </el-form-item>
    <el-form-item label="序列号" prop="serialNum">
      <el-input v-model="product.serialNum" />
    </el-form-item>
    <el-form-item label="机器码" prop="machineCode">
      <el-input v-model="product.machineCode" />
    </el-form-item>
    <el-form-item label="预警库存" prop="warnQty">
      <el-input v-model="product.warnQty" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSumit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { getProductById, createProduct, updateProduct } from '@/api/inventory/product'
import { Category } from '@/api/inventory/types/category'
import { getUnits } from '@/api/inventory/unit'
import { Unit } from '@/api/inventory/types/unit'

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  categories: {
    type: Array as PropType<Category[]>,
    required: true
  }
})
const emit = defineEmits(['close'])

const rules = ref({
  name: [
    { required: true, message: '请输入产品名称', trigger: 'change' }
  ],
  categoryId: [
    { required: true, message: '请选择产品类别', trigger: 'change' }
  ],
  unitId: [
    { required: true, message: '请选择产品单位', trigger: 'change' }
  ],
  size: [
    { required: true, message: '请输入产品规格', trigger: 'change' }
  ],
  description: [
    { required: false, message: '请输入产品描述', trigger: 'change' }
  ],
  serialNum: [
    { required: false, message: '请输入产品序列号', trigger: 'change' }
  ],
  machineCode: [
    { required: false, message: '请输入产品机器码', trigger: 'change' }
  ],
  warnQty: [
    { required: false, message: '请输入产品库存预警数量', trigger: 'change' }
  ]
})

const product = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  unitId: undefined as number | undefined,
  size: '',
  description: '',
  serialNum: '',
  machineCode: '',
  warnQty: ''
})

const { id } = toRefs(props)
onMounted(() => {
  if (id.value) loadProduct()
  loadUnits()
})
// 产品单位
const units = ref<Unit[]>([])
const loadUnits = async () => {
  const results = await getUnits()
  units.value = results
}
// 产品信息
const loadProduct = async () => {
  const {
    name,
    category: { id: categoryId },
    unit: { id: unitId },
    size,
    description,
    serialNum,
    machineCode,
    warnQty
  } = await getProductById(id.value)

  Object.assign(product, {
    name,
    categoryId,
    unitId,
    size,
    description,
    serialNum,
    machineCode,
    warnQty
  })
}
// 提交表单
const form = ref<InstanceType<typeof ElForm> | null>(null)
const handleSumit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!id.value) {
    await createProduct(product)
    ElMessage.success('创建成功')
  } else {
    console.log(id.value, product)
    await updateProduct(id.value, product)
    ElMessage.success('更新成功')
  }
  emit('close')
}

</script>
