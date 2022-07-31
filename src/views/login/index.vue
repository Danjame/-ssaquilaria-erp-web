<template>
  <div class="login-container">
    <el-form ref="form" class="login-form" label-position="top" :model="user" :rules="rules" @submit.prevent="handleLogin">
      <div class="login-form-header">
        <el-image style="width: 100px; height: 100px;" fit="fill" :src="logoSrc" />
        <p>中科沉香ERP系统</p>
      </div>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" placeholder="请输入手机号">
          <template #prefix>
            <el-icon style="width: 100%; height: 100%;">
              <component :is="'User'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="user.code" type="password" placeholder="请输入短信验证码">
          <template #prefix>
            <el-icon style="width: 100%; height: 100%;">
              <component :is="'Lock'" />
            </el-icon>
          </template>
          <template #append>
            <el-button @click="loadSmsCode()" :disabled="Boolean(count)">{{ count ? `${count}秒后重新发送` : '获取验证码' }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-button"
          type="primary"
          native-type="submit"
          :loading="isLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <p>北京中科沉香科技股份有限公司 版权所有 京ICP备2021002184号-1</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logoSrc from '@/assets/logo.png'
import { getSmsCode, login } from '@/api/system/auth'
import store from '@/store'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ElForm } from 'element-plus'

const form = ref<typeof ElForm>()

const rules = ref({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})

const user = reactive({
  phone: '',
  code: ''
})

const count = ref(0)
const interval = 60

onMounted(() => {
  const restCount = JSON.parse(localStorage.getItem('restCount') || 'null')
  const endTime = JSON.parse(localStorage.getItem('endTime') || 'null')

  if (restCount && endTime) {
    const passTime = Math.ceil((new Date().getTime() - endTime) / 1000)
    if (passTime < restCount) {
      count.value = restCount - passTime
      downcount()
    }
  }
})

// 发送验证码
const loadSmsCode = async () => {
  if (count.value > 0 && count.value < interval) return
  const valid = await form.value?.validateField('phone')
  if (!valid) return
  const res = await getSmsCode(user.phone)
  if (res.message === 'OK' && res.code === 'OK') {
    ElMessage.success('验证码发送成功')
    count.value = interval
    downcount()
  }
}

let timer: any
const downcount = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    if (count.value > 0 && count.value <= interval) {
      count.value--
      localStorage.setItem('restCount', JSON.stringify(count.value))
      localStorage.setItem('endTime', JSON.stringify((new Date()).getTime()))
      downcount()
    } else {
      clearTimeout(timer)
      timer = undefined
      localStorage.removeItem('restCount')
      localStorage.removeItem('endTime')
    }
  }, 1000)
}

// 登录
const isLoading = ref(false)
const route = useRoute()
const handleLogin = async () => {
  // 验证表单
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  isLoading.value = true
  const data = await login(user).finally(() => {
    isLoading.value = false
  })

  if (!data) return

  store.commit('setUser', data)
  ElMessage.success('登录成功')

  let redirect = route.query.redirect
  if (typeof redirect !== 'string') {
    redirect = '/'
  }
  router.replace(redirect)
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
