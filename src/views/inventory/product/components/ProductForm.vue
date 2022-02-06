<template>
  <Dialog
    :title="id ? '编辑产品' : '新增产品'"
    :submit="handleSubmit"
  >
    <el-form ref="form" :rules="rules" :model="product" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="product.name" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品类别" prop="categoryId">
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
      <el-form-item label="规格" prop="size">
        <el-input v-model="product.size" placeholder="请输入产品规格" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="product.description" autosize placeholder="请输入产品描述" />
      </el-form-item>
      <el-form-item label="序列号" prop="serialNum">
        <el-input v-model="product.serialNum" placeholder="请输入产品序列号" />
      </el-form-item>
      <el-form-item label="机器码" prop="machineCode">
        <el-input v-model="product.machineCode" placeholder="请输入输入机器码" />
      </el-form-item>
      <el-form-item label="预警库存" prop="warnQty">
        <el-input-number v-model="product.warnQty" :min="0" :controls="false" placeholder="请输入产品预警数量" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { Category } from '@/api/inventory/types/category'
import { PropType } from 'vue'
import { getAllUnits } from '@/api/inventory/unit'
import { Unit } from '@/api/inventory/types/unit'
import { getProductById, createProduct, updateProduct } from '@/api/inventory/product'
import { intValidator } from '@/utils/validator'

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

const rules = reactive({
  name: [
    { required: true, message: '产品名称不能为空', trigger: 'change' }
  ],
  categoryId: [
    { required: true, message: '产品类别不能为空', trigger: 'change' }
  ],
  unitId: [
    { required: true, message: '产品单位不能为空', trigger: 'change' }
  ],
  size: [
    { required: true, message: '产品规格不能为空', trigger: 'change' }
  ],
  description: [
    { required: false, message: '产品描述不能为空', trigger: 'change' }
  ],
  serialNum: [
    { required: false, message: '产品序列号不能为空', trigger: 'change' }
  ],
  machineCode: [
    { required: false, message: '产品机器码不能为空', trigger: 'change' }
  ],
  warnQty: [
    { validator: intValidator, trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadProduct()
  loadAllUnits()
})

// 产品单位
const units = ref<Unit[]>([])
const loadAllUnits = async () => {
  const results = await getAllUnits()
  units.value = results
}

// 产品信息
const product = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  unitId: undefined as number | undefined,
  size: '',
  description: '',
  serialNum: '',
  machineCode: '',
  warnQty: 0
})

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
  } = await getProductById(props.id)

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

// 表单提交
const form = ref<typeof ElForm | null>(null)
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createProduct(product)
    ElMessage.success('新增成功')
  } else {
    await updateProduct(props.id, product)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
