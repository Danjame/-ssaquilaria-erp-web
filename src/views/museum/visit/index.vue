<template>
  <Index
    title="参观"
    :params="listParams"
    :count="count"
    :data="visits"
    :load="loadVisits"
    :default-handler="false"
  >
    <template #form-item>
      <el-form-item label="预约人姓名" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入预约人姓名" />
      </el-form-item>
      <el-form-item label="预约人手机号" prop="phone">
        <el-input v-model="listParams.phone" placeholder="请输入预约人手机号" />
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="预约人姓名" prop="name" align="center" />
      <el-table-column label="预约人身份证号吗" prop="idNumber" align="center" />
      <el-table-column label="预约人电话" prop="phone" align="center" />
      <el-table-column label="参观人数" prop="total" align="center" />
      <el-table-column label="预约时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.createdAt).format('YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-popconfirm title="确定要删除该预约吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
  </Index>
</template>

<script lang="ts" setup>
import { getVisitsByConditions, deleteVisit } from '@/api/museum/visit'
import { Visit } from '@/api/museum/types/visit'
import moment from 'moment'

onMounted(() => {
  loadVisits()
})

// 预约列表
const listParams = reactive({
  name: undefined,
  phone: undefined,
  page: 1,
  size: 10
})
const visits = ref<Visit[]>([])
const count = ref(0)
const loadVisits = async () => {
  const { results, count: total } = await getVisitsByConditions(listParams)
  visits.value = results
  count.value = total
}

const handleDelete = async (id: number) => {
  await deleteVisit(id)
  ElMessage.success('删除成功')
  loadVisits()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
watch(() => listParams.phone, phone => {
  listParams.phone = !phone ? undefined : phone
})
</script>

<style lang="scss">
</style>
