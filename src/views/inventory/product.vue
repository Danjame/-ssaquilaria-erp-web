<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>产品库存</span>
      </div>
    </template>
    <el-table :data="products" border style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="serialNum" label="编码" />
      <el-table-column label="类别">
        <template #default="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="规格" />
      <el-table-column label="单位">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column label="供应商">
        <template #default="scope">
          <el-space>
            <el-tag
              v-for="(tag, index) in scope.row.suppliers.map((item: any) => item.name)"
              :key="index"
            >
              {{ tag }}
            </el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="库存" />
      <el-table-column prop="incomingQty" label="入库数量" />
      <el-table-column prop="outgoingQty" label="出库数量" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="sizes, prev, pager, next"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { getProdcutsByConditions } from '@/api/inventory/product'
import { onMounted, reactive, ref, watch } from 'vue'

const listParams = reactive({
  categoryId: undefined,
  page: 1,
  size: 10
})
const count = ref(0)
const products = ref([])

onMounted(() => {
  loadProducts()
})

const loadProducts = async () => {
  const { results, total } = await getProdcutsByConditions(listParams)
  products.value = results
  count.value = total
}

watch(() => listParams.page, page => {
  listParams.page = page
  loadProducts()
})

watch(() => listParams.size, size => {
  listParams.size = size
  loadProducts()
})

const handleEdit = (index, row) => {
  console.log(index, row)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

</script>

<style lang="scss" scoped>
</style>
