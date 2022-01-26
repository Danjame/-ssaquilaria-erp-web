<template>
  <el-icon :size="20" @click="toggleCollapse">
    <component :is="collapseIcon" />
  </el-icon>
</template>

<script lang="ts" setup>
import store from '@/store'
import { computed } from 'vue'

const collapseIcon = computed(() => {
  return store.state.isCollapse ? 'Expand' : 'Fold'
})

const toggleCollapse = () => {
  store.commit('setIsCollapse', !store.state.isCollapse)
}

</script>
