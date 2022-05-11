<template>
  <Dialog :title="id ? '编辑林场' : '新增林场'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="farm" label-width="100px">
      <el-form-item label="林场名称" prop="name">
        <el-input v-model="farm.name" placeholder="请输入林场名称" />
      </el-form-item>
      <el-form-item label="地区" prop="regionCodes">
        <el-cascader ref="cascader" v-model="farm.regionCodes" :props="cascaderProps" :options="provinces" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="farm.remark" placeholder="请输入备注" type="textarea" autosize />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getFarmById, createFarm, updateFarm } from '@/api/forest/farm'
import { FarmAttrs } from '@/api/forest/types/farm'
import { getAllProvinces } from '@/api/region/province'
import { Province } from '@/api/region/types/province'
import { getCitiesByProvince } from '@/api/region/city'
import { getDistrictsByCity } from '@/api/region/district'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const rules = reactive({
  name: [
    { required: true, message: '林场名称不能为空', trigger: 'change' }
  ],
  regionCodes: [
    { required: true, message: '地区不能为空', trigger: 'change' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'change' }
  ]
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

onMounted(() => {
  if (props.id) loadFarm()
  loadAllProvinces()
})

const provinces = ref<Province[]>([])
const loadAllProvinces = async () => {
  provinces.value = await getAllProvinces()
}

// 林场信息
const farm = reactive({} as FarmAttrs)
const loadFarm = async () => {
  const { name, province, city, district, regionCodes, remark } = await getFarmById(props.id)
  Object.assign(farm, { name, province, city, district, regionCodes, remark })
}

// 表单提交
const form = ref<typeof ElForm>()
const cascader = ref<typeof ElCascader>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  const [province, city, district] = cascader.value?.getCheckedNodes()[0].pathLabels
  farm.province = province
  farm.city = city
  farm.district = district

  if (!props.id) {
    await createFarm(farm)
    ElMessage.success('新增成功')
  } else {
    await updateFarm(props.id, farm)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
