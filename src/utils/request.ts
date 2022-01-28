import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'

const request = axios.create({
  // baseURL: import.meta.env.VITE_API_BASEURL
  baseURL: 'http://localhost:8080'
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  const { accessToken } = store.state
  if (accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`
  }
  // Do something before request is sent
  // config.headers.Authorization = token
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  ElMessage.error('操作失败：' + error.response.data.message)
  return Promise.reject(error)
})

export default <T = any>(config: AxiosRequestConfig) => {
  return request(config).then(res => {
    return (res.data.data || res.data) as T
  })
}
