<template>
  <Dialog :title="id ? '编辑树木' : '新增树木'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="tree" label-width="100px">
      <el-form-item label="树木品种" prop="name">
        <el-input v-model="tree.name" placeholder="请输入树木品种" />
      </el-form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="tree.farmId" placeholder="请选择林场">
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="林场区域" prop="areaId">
        <el-select v-model="tree.areaId" placeholder="请选择区域">
          <el-option v-for="(area, i) in areas" :key="i" :label="area.name" :value="area.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="行" prop="positionX">
        <el-input-number v-model="tree.positionX" :min="1" placeholder="请输入行" />
      </el-form-item>
      <el-form-item label="列" prop="positionY">
        <el-input-number v-model="tree.positionY" :min="1" placeholder="请输入列" />
      </el-form-item>
      <el-form-item label="芯片码" prop="machineCode">
        <el-input v-model="tree.machineCode" placeholder="请输入芯片码" />
      </el-form-item>
      <el-form-item label="种植时间" prop="plantedAt">
        <el-date-picker v-model="tree.plantedAt" type="date" placeholder="请输入种植时间" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { TreeAttrs } from '@/api/forest/types/tree'
import { Farm } from '@/api/forest/types/farm'
import { getAreasByFarm } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { getTreeById, createTree, updateTree } from '@/api/forest/tree'
import { validatePositionX, validatePositionY } from '@/utils/validator'

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
    { required: true, message: '树木品种不能为空', trigger: 'change' }
  ],
  farmId: [
    { required: true, message: '所属林场不能为空', trigger: 'change' }
  ],
  areaId: [
    { required: true, message: '林场区域不能为空', trigger: 'change' }
  ],
  positionX: [
    { required: true, validator: validatePositionX, trigger: 'change' }
  ],
  positionY: [
    { required: true, validator: validatePositionY, trigger: 'change' }
  ],
  machineCode: [
    { required: true, message: '芯片码不能为空', trigger: 'change' }
  ],
  plantedAt: [
    { required: true, message: '种植时间不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadTree()
})

// 林场区域
const areas = ref<Area[]>([])
const loadAreasByFarm = async (id: number) => {
  const results = await getAreasByFarm(id)
  areas.value = results
}

// 树木信息
const tree = reactive({} as TreeAttrs)
const loadTree = async () => {
  const {
    farm: { id: farmId },
    area: { id: areaId },
    name,
    positionX,
    positionY,
    machineCode,
    plantedAt
  } = await getTreeById(props.id)

  Object.assign(tree, {
    farmId,
    areaId,
    name,
    positionX,
    positionY,
    machineCode,
    plantedAt
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
    await createTree(tree)
    ElMessage.success('新增成功')
  } else {
    await updateTree(props.id, tree)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

let isEditFirstLoad = false
watch(() => tree.farmId, async id => {
  tree.farmId = !id ? undefined : id
  if (id) {
    // 是否为新增时的首次加载
    if (isEditFirstLoad) {
      isEditFirstLoad = false
    } else {
      tree.areaId = undefined
    }
    await loadAreasByFarm(id)
  }
})

</script>
