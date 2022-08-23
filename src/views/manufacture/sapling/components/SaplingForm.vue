<template>
  <Dialog :title="id ? '编辑苗木' : '新增苗木'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="sapling" label-width="100px">
      <el-form-item label="苗木名称" prop="name">
        <el-input v-model="sapling.name" placeholder="请输入苗木名称" />
      </el-form-item>
      <el-form-item label="单位" prop="unitId">
        <el-select v-model="sapling.unitId" placeholder="请选择单位">
          <el-option v-for="(unit, i) in units" :key="i" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="sapling.farmId" placeholder="请选择林场">
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="林场区域" prop="areaId">
        <el-select v-model="sapling.areaId" placeholder="请选择区域">
          <el-option v-for="(area, i) in areas" :key="i" :label="area.name" :value="area.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="sapling.description" autosize placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="预警库存" prop="warnQty">
        <el-input-number v-model="sapling.warnQty" :min="0" :controls="false" placeholder="请输入预警数量" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { getAllUnits } from '@/api/manufacture/unit'
import { Unit } from '@/api/manufacture/types/unit'
import { getSaplingById, createSapling, updateSapling } from '@/api/manufacture/sapling'
import { SaplingAttrs } from '@/api/manufacture/types/sapling'
import { validateQty } from '@/utils/validator'
import { getAreasByFarm } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { Farm } from '@/api/forest/types/farm'

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  farms: {
    type: Array as PropType<Farm[]>,
    required: true
  }
})

const rules = reactive({
  name: [
    { required: true, message: '苗木名称不能为空', trigger: 'blur' }
  ],
  unitId: [
    { required: true, message: '苗木单位不能为空', trigger: 'blur' }
  ],
  farmId: [
    { required: false, message: '所属林场不能为空', trigger: 'blur' }
  ],
  areaId: [
    { required: false, message: '林场区域不能为空', trigger: 'blur' }
  ],
  description: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ],
  warnQty: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadSapling()
  loadAllUnits()
})

// 单位
const units = ref<Unit[]>([])
const loadAllUnits = async () => {
  const results = await getAllUnits()
  units.value = results
}

// 林场区域
const areas = ref<Area[]>([])
const loadAreasByFarm = async (id: number) => {
  areas.value = await getAreasByFarm(id)
}

// 苗木信息
const sapling = reactive({} as SaplingAttrs)
const loadSapling = async () => {
  const s = await getSaplingById(props.id)
  const { name, unit: { id: unitId }, description, warnQty } = s
  const farmId = s.farm ? s.farm.id : undefined
  const areaId = s.area ? s.area.id : undefined

  Object.assign(sapling, {
    name,
    unitId,
    farmId,
    areaId,
    description,
    warnQty
  })

  isEditFirstLoad = true
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createSapling(sapling)
    ElMessage.success('新增成功')
  } else {
    await updateSapling(props.id, sapling)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

let isEditFirstLoad = false
watch(() => sapling.farmId, async id => {
  sapling.farmId = !id ? undefined : id
  if (id) {
    // 是否为新增时的首次加载
    if (isEditFirstLoad) {
      isEditFirstLoad = false
    } else {
      sapling.areaId = undefined
    }
    await loadAreasByFarm(id)
  }
})

</script>
