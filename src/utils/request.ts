import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string
})

/* —————————————————————————————————— 请求拦截 —————————————————————————————————— */
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.token) {
    config.headers!.Authorization = `Bearer ${user.token}`
  }
  // 设定 loding 状态
  if (config.url?.includes('/conditions')) {
    store.commit('setLoading', true)
  }

  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/* —————————————————————————————————— 响应拦截 —————————————————————————————————— */
// token 刷新锁
let isRefreshing = false
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  // 复原 loding 状态
  if (response.config.url?.includes('/conditions')) {
    store.commit('setLoading', false)
  }

  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const { user } = store.state

  if (!error.response) {
    // 服务离线
    if (!axios.isCancel(error)) {
      ElMessageBox.alert('服务不可用，请联系管理员', 'HTTP 503 错误')
    }
  } else {
    // 复原 loding 状态
    if (error.response.config.url.includes('/conditions')) {
      store.commit('setLoading', false)
    }

    // token 过期/无效
    switch (error.response.status) {
      case 401:
        // 登录失败
        if (error.response.data.message === 'Invalid User' || error.response.config.url === '/auth/login/sms') {
          return ElMessage.error('手机号/验证码不正确')
        }

        if (isRefreshing) return

        isRefreshing = true

        if (!user || !user.token) {
          // First Login
          toLogin()
          isRefreshing = false
        } else {
          // Token Expirated
          ElMessageBox.confirm(
            '您的登录状态已过期，请重新登录。',
            '登录过期',
            {
              confirmButtonText: '登录',
              cancelButtonText: '取消'
            }
          ).then(() => {
            toLogin()
          }).finally(() => {
            isRefreshing = false
          })
        }
        break
      case 403:
        if (error.response.data.message === 'Account Disabled') {
          ElMessageBox.confirm(
            '您的账号不可用，请联系管理员。',
            '账号不可用',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消'
            }
          ).then(() => {
            toLogin()
          })
        } else {
          return ElMessage.error(error.response.data.message)
        }
        break
      case 400:
        if (error.response.config.url !== '/commerce/commodities/by-serial-number/') {
          if (typeof error.response.data.message === 'object') {
            error.response.data.message = error.response.data.message.toString()
          }

          return ElMessage.error(error.response.data.message)
        }
        break
      default:
        if (error.response.data.message) {
          if (typeof error.response.data.message === 'object') {
            error.response.data.message = error.response.data.message.toString()
          }

          return ElMessage.error(error.response.data.message)
        }
    }
  }

  return Promise.reject(error)
})

const toLogin = () => {
  store.commit('setUser', null)
  router.push({
    name: 'login',
    query: { redirect: router.currentRoute.value.fullPath }
  })
}

export default <T = any>(config: AxiosRequestConfig) => {
  return request(config).then(res => {
    return (res.data.data || res.data) as T
  })
}
