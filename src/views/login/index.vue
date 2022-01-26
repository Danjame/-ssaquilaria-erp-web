<template>
  <div class="login-container">
    <el-form ref="form" class="login-form" label-position="top" :model="user" :rules="rules" @submit.prevent="handleSubmit">
      <div class="login-form-header">
        <el-image style="width: 100px; height: 100px;" fit="fill" :src="logoSrc" />
        <p>中科沉香ERP系统</p>
      </div>
      <el-form-item label="账号" prop="username">
        <el-input v-model="user.username" placeholder="请输入账号">
          <template #prefix>
            <el-icon style="width: 100%; height: 100%;">
              <component :is="'User'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password" placeholder="请输入密码">
          <template #prefix>
            <el-icon style="width: 100%; height: 100%;">
              <component :is="'Lock'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-button" type="primary" native-type="submit">登陆</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <p>北京中科沉香科技股份有限公司 版权所有 京ICP备2021002184号-1</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { login } from '@/api/system/user'
import logoSrc from '@/assets/logo.png'
import store from '@/store'
import router from '@/router'

const form = ref<InstanceType<typeof ElForm> | null>(null)

const user = reactive({
  username: 'ssaquilaria',
  password: 'ssa123'
})

const isLoading = ref(false)

const rules = ref({
  username: [
    { required: true, message: '请输入账号', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' }
  ]
})

const handleSubmit = async () => {
  isLoading.value = true
  // 验证表单
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  try {
    const { accessToken } = await login(user)
    store.commit('setAccessToken', accessToken)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err) {
    ElMessage.error('账号/密码错误')
  }
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: $body-bg;
  }
.login-form {
  min-width: 300px;
  background: #fff;
  padding: 30px;
  border-radius: 6px;
  &-header {
    text-align: center;
    color:$primary-color;
    p {
      font-size: small;
    }
    .el-icon{
      width: 100%;
      height: 100%;
    }
  }
  .submit-button {
    width: 100%;
    margin-top: 30px;
  }
}
.footer {
  text-align: center;
  font-size: 10px;
  color: $info-color;
}

</style>
