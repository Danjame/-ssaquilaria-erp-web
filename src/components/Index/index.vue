<template>
  <el-card>
    <template #header>
      <el-form v-if="filter" ref="form" inline :model="params" :disabled="store.state.isLoading">
        <slot name="form-item" />
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="load">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button-group v-if="handlerBtns">
        <el-button type="primary" :icon="'Plus'" @click="handlerA">新增{{ title }}</el-button>
        <slot name="form-item-button" />
      </el-button-group>
    </template>
    <el-table :data="data" v-loading="store.state.isLoading">
      <slot name="table-column" />
    </el-table>
    <Pagination
      v-model:page="params.page"
      v-model:size="params.size"
      :count="count"
      :load-list="load"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <slot name="a" />
  <slot name="b" />
  <slot name="c" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import store from '@/store'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  load: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve()
  },
  handlerA: {
    type: Function,
    default: () => {}
  },
  filter: {
    type: Boolean,
    default: true
  },
  handlerBtns: {
    type: Boolean,
    default: true
  }
})

const { title, params, count, data } = toRefs(props)

const form = ref<typeof ElForm>()
const resetFields = (form: ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  props.load()
}

</script>

<style lang="scss" scoped>

</style>
