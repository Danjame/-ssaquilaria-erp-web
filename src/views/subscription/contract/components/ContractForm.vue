<template>
  <Dialog :title="id ? '编辑协议' : '新增协议'" :submit="handleSubmit">
    <el-form ref="form" :model="contract" :rules="rules" label-width="150px">
      <el-form-item label="认养证号" prop="contractNo">
        <el-input v-model="contract.contractNo" placeholder="请输入认养证号" />
      </el-form-item>
      <el-form-item label="认养树种" prop="treeName">
        <el-input v-model="contract.treeName" placeholder="请输入认养树种" />
      </el-form-item>
      <el-form-item label="林场">
        <el-input v-model="contract.treeFarm" disabled />
      </el-form-item>
      <el-form-item label="区域">
        <el-input v-model="contract.treeArea" disabled />
      </el-form-item>
      <el-form-item label="树木编号" prop="serials">
        <el-input v-model="contract.serials" type="textarea" autosize placeholder="请输入树木编号" />
      </el-form-item>
      <el-form-item label="认养数量" prop="treeCount">
        <el-input v-model="contract.treeCount" disabled />
      </el-form-item>
      <el-form-item label="认养周期" prop="startDate">
        <el-date-picker
          v-model="contract.startDate"
          type="date"
          placeholder="开始日期"
          size="default"
        />
      </el-form-item>
      <el-form-item prop="endDate">
        <el-date-picker
          v-model="contract.endDate"
          type="date"
          placeholder="结束日期"
          size="default"
        />
      </el-form-item>
      <el-form-item label="认养人姓名" prop="subscriberName">
        <el-input v-model="contract.subscriberName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="认养人身份证号" prop="subscriberID">
        <el-input v-model="contract.subscriberID" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="认养人手机号" prop="subscriberPhone">
        <el-input v-model="contract.subscriberPhone" placeholder="请输入手机号" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { createContract, getContractById, updateContract } from '@/api/subscription/contract'
import { ContractAttrs } from '@/api/subscription/types/contract'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  contractNo: [
    { required: true, message: '认养证号不能为空', trigger: 'blur' }
  ],
  treeName: [
    { required: true, message: '认养树种不能为空', trigger: 'blur' }
  ],
  serials: [
    { required: true, message: '树木编号不能为空', trigger: 'blur' }
  ],
  subscriberName: [
    { required: true, message: '认养人姓名不能为空', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '请输入正确的姓名', trigger: 'blur' }
  ],
  subscriberID: [
    { required: true, message: '认养人身份证不能为空', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20|21|22)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/, message: '请输入正确的身份证号', trigger: 'blur' }
  ],
  subscriberPhone: [
    { required: true, message: '认养人手机号不能为空', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: '认养起始时间不能为空', trigger: 'blur' }
  ],
  endDate: [
    { required: true, message: '认养结束时间不能为空', trigger: 'blur' }
  ]
})

onMounted(async () => {
  if (props.id) await loadContract()
})

// 协议信息
const contract = reactive({} as ContractAttrs)

const loadContract = async () => {
  const {
    trees,
    ...attrs
  } = await getContractById(props.id)

  Object.assign(contract, {
    ...attrs,
    serials: trees ? trees.map(tree => tree.serialNum).join(',') : '',
  })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = form.value?.validate()
  if (!valid) return

  if (
    !await form.value?.validateField('subscriberName') ||
    !await form.value?.validateField('subscriberID') ||
    !await form.value?.validateField('subscriberPhone')
  ) return
  // 验证通过
  contract.treeSerials = contract.serials?.split(',');
  if (!props.id) {
    await createContract(contract)
    ElMessage.success('新增成功')
  } else {
    await updateContract(props.id, contract)
    ElMessage.success('更新成功')
  }

  emit('submit')
}

</script>
