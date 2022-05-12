<template>
  <Index
    title="林场"
    :params="listParams"
    :count="count"
    :data="farms"
    :load="loadFarms"
    :handler-a="openForm"
    :filter="false"
  >
    <template #form>
      <el-form ref="form" inline :model="listParams" :disabled="store.state.isLoading">
        <el-form-item label="林场名称" prop="name">
          <el-input v-model="listParams.name" placeholder="请输入林场名称" />
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-cascader v-model="listParams.region" :props="cascaderProps" :options="provinces" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="loadFarms">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <template #table-column>
      <el-table-column type="expand">
        <template #default="scope">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="林区" align="center" label-class-name="farm-desc-label">
              <span v-if="!scope.row.areas.length">-</span>
              <el-space v-else>
                <el-tag v-for="(area, i) in scope.row.areas" :key="i">{{ area.name }}</el-tag>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="备注" align="center" label-class-name="farm-desc-label">{{ scope.row.remark ? scope.row.remark : '-' }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="林场名称" prop="name" align="center" />
      <el-table-column label="地区" align="center">
        <el-table-column label="省份" prop="province" align="center" />
        <el-table-column label="城市" prop="city" align="center" />
        <el-table-column label="区/县" prop="district" align="center" />
      </el-table-column>
      <el-table-column label="林区数量" prop="areaCount" align="center" />
      <el-table-column label="树木数量" prop="treeCount" align="center" />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该林场吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <FarmForm
        v-if="formVisible"
        v-model="formVisible"
        :id="farmId"
        @submit="onFormSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import FarmForm from './components/FarmForm.vue'
import { getFarmsByConditions, deleteFarm } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'
import { getAllProvinces } from '@/api/region/province'
import { Province } from '@/api/region/types/province'
import { getCitiesByProvince } from '@/api/region/city'
import { getDistrictsByCity } from '@/api/region/district'
import store from '@/store'

onMounted(() => {
  loadAllProvinces()
  loadFarms()
})

const cascaderProps = {
  label: 'name',
  value: 'code',
  lazy: true,
  lazyLoad (node: any, resolve: any) {
    const { data: { code }, level } = node
    if (level === 1) {
      getCitiesByProvince(code).then(cities => resolve(cities as []))
    } else if (level === 2) {
      getDistrictsByCity(code).then(districts => {
        districts.forEach(item => {
          item.leaf = true
        })
        resolve(districts as [])
      })
    } else {
      resolve()
    }
  }
}

const provinces = ref<Province[]>([])
const loadAllProvinces = async () => {
  provinces.value = await getAllProvinces()
}

// 林场列表
const listParams = reactive({
  name: undefined,
  region: undefined as string[] | undefined,
  page: 1,
  size: 10
})
const farms = ref<Farm[]>([])
const count = ref(0)
const loadFarms = async () => {
  const { name, region, page, size } = listParams
  const regionCodes = region && region.length ? region.toString() : undefined
  const data = await getFarmsByConditions({ name, regionCodes, page, size })
  farms.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const farmId = ref<number | undefined>(undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    farmId.value = payload
  } else {
    farmId.value = undefined
  }
  formVisible.value = true
}

const form = ref<typeof ElForm>()
const cascader = ref<typeof ElCascader>()
const resetFields = (form: typeof ElForm | undefined) => {
  if (!cascader.value && !form) return
  if (form) form.resetFields()
  if (cascader.value) cascader.value.panel.clearCheckedNodes()
  loadFarms()
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadFarms()
}

const handleDelete = async (id: number) => {
  await deleteFarm(id)
  ElMessage.success('删除成功')
  loadFarms()
}

// 监听参数变化
watch(() => listParams.name, name => {
  listParams.name = !name ? undefined : name
})
</script>

<style lang="scss">
.farm-desc-label.el-descriptions__label {
  width: 20%;
}
</style>
