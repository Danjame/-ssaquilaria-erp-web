<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item
      v-for="(route, index) in routes"
      :key="index"
    >
      {{ route.meta!.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue'
import { RouteRecordRaw } from 'vue-router'

const props = defineProps({
  routes: {
    type: Object as PropType<RouteRecordRaw[]>,
    required: true
  }
})

const { routes } = toRefs(props)

</script>
