<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline>
        <el-form-item label="产品名称">
          <el-input v-model="listParams.name" placeholder="请输入产品名称">
            <template #append>
              <el-button :icon="'Search'" @click="loadProducts" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="产品类别">
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
      <el-table-column label="产品名称" prop="name" align="center" />
      <el-table-column label="序列号" prop="serialNum" align="center" />
      <el-table-column label="产品类别" align="center">
        <template #default="scope">
          <span>{{ scope.row.category.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="size" align="center" />
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center" />
      <el-table-column label="供应商" align="center">
        <template #default="scope">
          <el-space>
            <el-tag
              v-for="(tag, index) in scope.row.suppliers.map((item: any) => item.name)"
              :key="index"
            >{{ tag }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stockQty" align="center" />
      <el-table-column label="入库数量" prop="incomingQty" align="center" />
      <el-table-column label="出库数量" prop="outgoingQty" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openCreateOrEdit(scope.row.id)">编辑</el-button>
            <el-popconfirm
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
      layout="total, sizes, prev, pager, next, jumper"
      align="right"
      :page-sizes="[10, 15, 20]"
      :total="count"
      v-model:current-page="listParams.page"
      v-model:page-size="listParams.size"
    />
  </el-card>
  <ProductForm
    v-if="visible"
    v-model="visible"
    :id="productId"
    :categories="categories"
    @submit="onSubmitted"
  />
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
  const data = await getAllCategories()
  categories.value = data
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
  const { results, total } = await getProductsByConditions(listParams)
  products.value = results
  count.value = total
}

// 显示隐藏 form
const visible = ref(false)
const productId = ref(undefined as number | undefined)
const openCreateOrEdit = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    productId.value = payload
  } else {
    productId.value = undefined
  }
  visible.value = true
}

const onSubmitted = () => {
  visible.value = false
  loadProducts()
}

const handleDelete = async (id: number) => {
  await deleteProduct(id)
  ElMessage.success('删除成功')
  return true
}

// 监听参数变化
watch(() => [listParams.page, listParams.size], () => {
  loadProducts()
})
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.categoryId, id => {
  listParams.categoryId = !id ? undefined : id
  loadProducts()
})
</script>
