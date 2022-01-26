<template>
  <el-form ref="formRef" :model="form" label-width="120px">
    <el-form-item label="名称">
      <el-input v-model="form.name" autocomplete="off" />
    </el-form-item>
    <el-form-item label="规格">
      <el-input v-model="form.size" autocomplete="off" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  size: ''
})
</script>
