<template>
  <Index
    title="协议"
    :params="listParams"
    :count="count"
    :data="contracts"
    :load="loadContracts"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="认养证号" prop="contractNo">
        <el-input v-model="listParams.contractNo" placeholder="请输入认养证号" />
      </el-form-item>
      <el-form-item label="认养人姓名" prop="subscriberName">
        <el-input v-model="listParams.subscriberName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="认养人身份证" prop="subscriberID">
        <el-input v-model="listParams.subscriberID" placeholder="请输入身份证" />
      </el-form-item>
      <el-form-item label="认养人手机号" prop="subscriberPhone">
        <el-input v-model="listParams.subscriberPhone" placeholder="请输入手机号" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="认养证号" prop="contractNo" align="center" />
      <el-table-column label="认养人姓名" prop="subscriberName" align="center" />
      <el-table-column label="认养数量" prop="treeCount" align="center" />
      <el-table-column label="联系方式" prop="subscriberPhone" align="center" />
      <el-table-column label="认养周期" align="center">
        <template #default="scope">
          <el-tag>开始：{{ scope.row.startDate.slice(0, 10) }}</el-tag>
          <el-tag>结束：{{ scope.row.endDate.slice(0, 10) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该协议吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <ContractForm
        v-if="formVisible"
        v-model="formVisible"
        :id="contractId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import ContractForm from './components/ContractForm.vue'
import { getContractsByConditions, deleteContract } from '@/api/subscription/contract'
import { Contract } from '@/api/subscription/types/contract'

onMounted(() => {
  loadContracts()
})

// 协议列表
const listParams = reactive({
  contractNo: undefined,
  subscriberName: undefined,
  subscriberID: undefined,
  subscriberPhone: undefined,
  page: 1,
  size: 10
})
const contracts = ref<Contract[]>([])
const count = ref(0)
const loadContracts = async () => {
  const { results, count: total } = await getContractsByConditions(listParams)
  contracts.value = results
  count.value = total
}

// 新增与编辑组件
const formVisible = ref(false)
const contractId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    contractId.value = payload
  } else {
    contractId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadContracts()
}

const handleDelete = async (id: number) => {
  await deleteContract(id)
  ElMessage.success('删除成功')
  loadContracts()
}

// 监听参数变化
watch(() => listParams.contractNo, contractNo => {
  listParams.contractNo = !contractNo ? undefined : contractNo
})
watch(() => listParams.subscriberName, subscriberName => {
  listParams.subscriberName = !subscriberName ? undefined : subscriberName
})
watch(() => listParams.subscriberID, subscriberID => {
  listParams.subscriberID = !subscriberID ? undefined : subscriberID
})
watch(() => listParams.subscriberPhone, subscriberPhone => {
  listParams.subscriberPhone = !subscriberPhone ? undefined : subscriberPhone
})
</script>

<style lang="scss">
.contract-desc-label.el-descriptions__label {
  width: 10%;
}
.contract-desc-content.el-descriptions__content {
  width: 40%;
}
</style>
