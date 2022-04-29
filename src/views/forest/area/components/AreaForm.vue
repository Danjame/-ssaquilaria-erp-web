<template>
  <Dialog :title="id ? '编辑区域' : '新增区域'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="area" label-width="100px">
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="area.name" placeholder="请输入林场名称" />
      </el-form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="area.farmId" placeholder="请选择林场">
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="area.remark" placeholder="请输入备注" type="textarea" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Farm } from '@/api/forest/types/farm'
import { getAreaById, createArea, updateArea } from '@/api/forest/area'

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
    { required: true, message: '区域名称不能为空', trigger: 'change' }
  ],
  farmId: [
    { required: true, message: '林场不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadArea()
})

// 区域信息
const area = reactive({})
const loadArea = async () => {
  const { farm: { id: farmId }, name, remark } = await getAreaById(props.id)
  Object.assign(area, { farmId, name, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createArea(area)
    ElMessage.success('新增成功')
  } else {
    await updateArea(props.id, area)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
