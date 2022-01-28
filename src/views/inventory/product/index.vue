<template>
  <el-card>
    <template #header>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="listParams.name" placeholder="请输入产品名称">
            <template #append>
              <el-button :icon="'Search'" @click="loadProducts" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="listParams.categoryId" placeholder="请选择产品类别" clearable>
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openCreateOrEdit">新增产品</el-button>
    </template>
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="serialNum" label="编码" align="center" />
      <el-table-column label="类别" align="center">
        <template #default="scope">
          <span>{{ scope.row.category.label }}</span>
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
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button
              type="text"
              @click="openCreateOrEdit(scope.row.id)"
            >编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="'InfoFilled'"
              icon-color="red"
              title="确定要删除该产品吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
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
  <el-dialog
    v-model="dialogVisible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    title="编辑产品"
  >
    <CreateOrEdit :id="productId" :categories="categories" @close="closeCreateOrEdit" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { getCategories } from '@/api/inventory/category'
import { getProductsByConditions, deleteProductById } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import CreateOrEdit from './components/CreateOrEdit.vue'
import { Category } from '@/api/inventory/types/category'

const listParams = reactive({
  name: undefined,
  categoryId: undefined,
  page: 1,
  size: 10
})
const count = ref(0)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const dialogVisible = ref(false)
const productId = ref(undefined as number | undefined)

onMounted(() => {
  loadCategories()
  loadProducts()
})

const loadCategories = async () => {
  const data = await getCategories()
  categories.value = data
}

const loadProducts = async () => {
  if (listParams.name === '') listParams.name = undefined
  const { results, total } = await getProductsByConditions(listParams)
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

watch(() => listParams.categoryId, id => {
  listParams.categoryId = !id ? undefined : id
  loadProducts()
})

const openCreateOrEdit = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    productId.value = payload
  } else {
    productId.value = undefined
  }
  dialogVisible.value = true
}

const closeCreateOrEdit = () => {
  dialogVisible.value = false
}

const handleDelete = async (id: number) => {
  await deleteProductById(id)
  ElMessage.success('删除成功')
  return true
}

</script>

<style lang="scss" scoped>
</style>
