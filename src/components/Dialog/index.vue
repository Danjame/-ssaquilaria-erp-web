<template>
  <el-dialog
    ref="dialog"
    v-model="visible"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="el-dialog-container"
    center
  >
    <slot />
    <template #footer>
      <span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const visible = false
const dialog = ref<typeof ElDialog | null>(null)

const handleCancel = () => {
  dialog.value!.visible = false
}

// 确认提交
const isLoading = ref(false)
const props = defineProps({
  submit: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve()
  }
})
const handleSubmit = async () => {
  isLoading.value = true
  props.submit().finally(() => {
    isLoading.value = false
  })
}

</script>

<style lang="scss">
.el-dialog-container {
  max-width: 500px;
}
</style>
