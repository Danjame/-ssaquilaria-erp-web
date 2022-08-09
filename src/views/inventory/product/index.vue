<template>
  <Index
    title="产品"
    :params="listParams"
    :count="count"
    :data="products"
    :load="loadProducts"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品类别" prop="categoryId">
        <el-select v-model="listParams.categoryId" placeholder="请选择产品类别" clearable>
          <el-option v-for="(category, i) in categories" :key="i" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
    </template>
    <template #table-column>
      <el-table-column label="产品名称" prop="name" align="center" />
      <el-table-column label="产品类别" align="center">
        <template #default="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="size" align="center" />
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原料" align="center">
        <template #default="scope">
          <span>{{ scope.row.material ? scope.row.material.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stockQty" align="center" />
      <el-table-column label="入库数量" prop="incomingQty" align="center" />
      <el-table-column label="出库数量" prop="outgoingQty" align="center" />
      <el-table-column label="操作" min-width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该产品吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <ProductForm
        v-if="formVisible"
        v-model="formVisible"
        :id="productId"
        :categories="categories"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import ProductForm from './components/ProductForm.vue'
import { getAllCategories } from '@/api/inventory/category'
import { Category } from '@/api/inventory/types/category'
import { getProductsByConditions, deleteProduct } from '@/api/inventory/product'
import { Product } from '@/api/inventory/types/product'

onMounted(() => {
  loadAllCategories()
  loadProducts()
})

// 产品类别
const categories = ref<Category[]>([])
const loadAllCategories = async () => {
  categories.value = await getAllCategories()
}

// 产品列表
const listParams = reactive({
  name: undefined,
  categoryId: undefined,
  page: 1,
  size: 10
})
const products = ref<Product[]>([])
const count = ref(0)
const loadProducts = async () => {
  const data = await getProductsByConditions(listParams)
  products.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const productId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    productId.value = payload
  } else {
    productId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadProducts()
}

const handleDelete = async (id: number) => {
  await deleteProduct(id)
  ElMessage.success('删除成功')
  loadProducts()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.categoryId, id => {
  listParams.categoryId = !id ? undefined : id
})
</script>
