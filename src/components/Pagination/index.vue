<template>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 15, 20]"
    v-model:current-page="page"
    v-model:page-size="size"
    :total="count"
  />
</template>
<script lang="ts" setup>
import { PropType } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  size: {
    type: Number,
    default: 10
  },
  count: {
    type: Number,
    default: 0
  },
  loadList: {
    type: Function as PropType<(...args: any[]) => void>,
    defautl: () => { }
  }
})

interface EmitsType {
  (e: 'update:page', page: number): void
  (e: 'update:size', size: number): void
}
const emit = defineEmits<EmitsType>()

// 监听参数变化
watch(() => props.page, page => {
  emit('update:page', page)
  props.loadList && props.loadList()
})

watch(() => props.size, size => {
  emit('update:size', size)
  emit('update:page', 1)
  props.loadList && props.loadList()
})

</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>