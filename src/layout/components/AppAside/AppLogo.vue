<template>
  <div class="container">
    <img style="height: 40px" src="@/assets/logo.png">
    <span v-if="!store.state.isCollapse" class="title">中科沉香</span>
  </div>
</template>

<script lang="ts" setup>
import store from '@/store'

</script>

<style lang="scss" scoped>
.container{
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    margin-left: 10px;
  }
}
</style>
