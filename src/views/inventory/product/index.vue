<template>
  <el-card class="box-card">
    <template #header>
      筛选
    </template>
    <el-form ref="formRef" label-width="120px">
      <el-form-item label="名称">
        <el-input />
      </el-form-item>
      <el-form-item label="规格">
        <el-input />
      </el-form-item>
    </el-form>
    <el-button :icon="'Search'">搜索</el-button>
  </el-card>
  <el-card class="box-card">
    <template #header>
      <el-button type="primary" :icon="'Plus'">新增产品</el-button>
    </template>
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="serialNum" label="编码" align="center" />
      <el-table-column label="类别" align="center">
        <template #default="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="规格" align="center" />
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column label="供应商" align="center">
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
      <el-table-column prop="stockQty" label="库存" align="center" />
      <el-table-column prop="incomingQty" label="入库数量" align="center" />
      <el-table-column prop="outgoingQty" label="出库数量" align="center" />
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </el-space>
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
  <el-dialog v-model="dialogVisible" title="编辑产品">
    <CreateOrEdit />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { getProdcutsByConditions } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import CreateOrEdit from './components/CreateOrEdit.vue'

const listParams = reactive({
  categoryId: undefined,
  page: 1,
  size: 10
})
const count = ref(0)
const products = ref<Product[]>([])
const dialogVisible = ref(false)

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

const handleEdit = (product: Product) => {
  dialogVisible.value = true
  console.log(product)
}

const handleDelete = (product: Product) => {
  console.log(product)
}

</script>

<style lang="scss" scoped>
</style>
