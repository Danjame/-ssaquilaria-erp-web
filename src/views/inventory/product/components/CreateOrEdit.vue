<template>
  <el-form-item label="名称">
    <el-input v-model="form.name" autocomplete="off" />
  </el-form-item>
  <el-form-item label="规格">
    <el-input v-model="form.size" autocomplete="off" />
  </el-form-item>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  size: ''
})
</script>
