import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import router from '@/router'
import store from '@/store'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.getters.token
  if (token) {
    const time = Date.now() - getTime()
    // 2 * 60 * 60 * 1000 2个小时
    // 判断token是不是有两个小时，如果有就重新登录
    if (time > 7200000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
    /* config.headers = {
      Authorization: 'Bearer ' + token
    } */
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对响应错误做点什么
  // 服务器token超时
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  return Promise.reject(error)
})
export default request
