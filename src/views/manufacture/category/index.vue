<template>
  <Index
    title="产品类别"
    :params="listParams"
    :count="count"
    :data="categories"
    :load="loadCategories"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="产品名称" prop="productId">
        <el-select v-model="listParams.productId" placeholder="请选择产品" clearable>
          <el-option v-for="(product, i) in products" :key="i" :label="product.name" :value="product.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="类别名称" prop="name" align="center" />
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该产品类别吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <CategoryForm
        v-if="formVisible"
        v-model="formVisible"
        :id="categoryId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import CategoryForm from './components/CategoryForm.vue'
import { getAllProducts } from '@/api/manufacture/product'
import { Product } from '@/api/manufacture/types/product'
import { getCategoriesByConditions, deleteCategory } from '@/api/manufacture/category'
import { Category } from '@/api/manufacture/types/category'

onMounted(() => {
  loadAllProducts()
  loadCategories()
})

// 产品
const products = ref<Product[]>([])
const loadAllProducts = async () => {
  products.value = await getAllProducts()
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
  const data = await getCategoriesByConditions(listParams)
  categories.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const categoryId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    categoryId.value = payload
  } else {
    categoryId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadCategories()
}

const handleDelete = async (id: number) => {
  await deleteCategory(id)
  ElMessage.success('删除成功')
  loadCategories()
}

// 监听参数变化
watch(() => listParams.productId, productId => {
  listParams.productId = !productId ? undefined : productId
})
</script>

<style lang="scss" scoped>

</style>
