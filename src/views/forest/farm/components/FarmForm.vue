<template>
  <Dialog :title="id ? '编辑林场' : '新增林场'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="farm" label-width="100px">
      <el-form-item label="林场名称" prop="name">
        <el-input v-model="farm.name" placeholder="请输入林场名称" />
      </el-form-item>
      <el-form-item label="省份" prop="province">
        <el-input v-model="farm.province" placeholder="请输入省份" />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input v-model="farm.city" placeholder="请输入城市" />
      </el-form-item>
      <el-form-item label="区/县" prop="district">
        <el-input v-model="farm.district" placeholder="请输入区/县" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="farm.remark" placeholder="请输入备注" type="textarea" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getFarmById, createFarm, updateFarm } from '@/api/forest/farm'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const rules = reactive({
  name: [
    { required: true, message: '林场名称不能为空', trigger: 'change' }
  ],
  province: [
    { required: true, message: '省份不能为空', trigger: 'change' }
  ],
  city: [
    { required: true, message: '城市不能为空', trigger: 'change' }
  ],
  district: [
    { required: true, message: '区/县不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
})

onMounted(() => {
  if (props.id) loadFarm()
})

// 林场信息
const farm = reactive({})
const loadFarm = async () => {
  Object.assign(farm, await getFarmById(props.id))
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createFarm(farm)
    ElMessage.success('新增成功')
  } else {
    await updateFarm(props.id, farm)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
