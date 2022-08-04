<template>
  <Dialog :title="id ? '编辑级别' : '新增级别'" :submit="handleSubmit">
    <el-form ref="form" :model="rank" :rules="rules" label-width="100px">
      <el-form-item label="级别名称" prop="name">
        <el-input v-model="rank.name" placeholder="请输入级别名称" />
      </el-form-item>
      <el-form-item label="规格" prop="specification">
        <el-input v-model="rank.specification" placeholder="请输入规格" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="rank.remark" autosize placeholder="请输入描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createRank, getRankById, updateRank } from '@/api/inventory/rank'
import { RankAttrs } from '@/api/inventory/types/rank'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '级别名称不能为空', trigger: 'blur' }
  ],
  specification: [
    { required: false, message: '规格不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadRank()
})

// 级别信息
const rank = reactive({} as RankAttrs)
const loadRank = async () => {
  const { name, remark } = await getRankById(props.id)
  Object.assign(rank, { name, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createRank(rank)
    ElMessage.success('新增成功')
  } else {
    await updateRank(props.id, rank)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
