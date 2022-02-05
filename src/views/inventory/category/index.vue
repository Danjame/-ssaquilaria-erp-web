<template>
  <el-card>
    <template #header>
      <el-form ref="form">
        <el-form-item label="产品名称">
          <el-select v-model="listParams.productId" placeholder="请选择产品名称" clearable>
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增类别</el-button>
    </template>
    <el-table :data="categories" style="width: 100%">
      <el-table-column label="分类名" prop="name" align="center" />
      <el-table-column label="分类值" prop="value" align="center" />
      <el-table-column label="分类标签" prop="label" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space>
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="'InfoFilled'"
              icon-color="red"
              title="确定要删除该产品分类吗?"
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
      layout="total, sizes, prev, pager, next, jumper"
      align="right"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <CategoryForm
    v-if="visible"
    v-model="visible"
    :id="categoryId"
    @submit="onSubmitted"
  />
</template>

<script lang="ts" setup>
import CategoryForm from './components/CategoryForm.vue'
import { getAllProducts } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'
import { getCategoriesByConditions, deleteCategory } from '@/api/inventory/category'
import { Category } from '@/api/inventory/types/category'

onMounted(() => {
  loadAllProducts()
  loadCategories()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  const results = await getAllProducts()
  products.value = results
}

// 类别列表
const listParams = reactive({
  productId: undefined,
  page: 1,
  size: 10
})
const categories = ref<Category[]>([])
const count = ref(0)
const loadCategories = async () => {
  const { results, total } = await getCategoriesByConditions(listParams)
  categories.value = results
  count.value = total
}

// 显示隐藏 dialog
const visible = ref(false)
const categoryId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    categoryId.value = payload
  } else {
    categoryId.value = undefined
  }
  visible.value = true
}

const onSubmitted = () => {
  visible.value = false
  loadCategories()
}

const handleDelete = async (id: number) => {
  await deleteCategory(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadCategories()
})
watch(() => listParams.productId, productId => {
  listParams.productId = !productId ? undefined : productId
  loadCategories()
})
</script>

<style lang="scss" scoped>

</style>
