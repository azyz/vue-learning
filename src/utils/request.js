import axios from 'axios'
import { useUserStroe } from '../stores/pinia'
import { ElMessage } from 'element-plus'
import router from '../router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  //基准地址，超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const userStore = useUserStroe()
    //如果token存在，需要让请求头去携带
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 响应数据 对处理业务判断
    if (response.data.code === 0) {
      //code:0 =>处理业务成功
      return response
    }
    //处理失败 给出错误提示，抛出错误
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  (error) => {
    // 错误提示
    //错误的特殊情况 => 401 权限不足或token过期 => 拦截到登录
    if (error.response?.status === 401) {
      router.push('/login')
    }

    //错误的默认情况 => 给出提示
    ElMessage.error(error.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default instance // 默认导出
export { baseURL } //按需导出
