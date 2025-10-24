import { useRouter } from 'vue-router'
import { userInfoInterface } from '@/template/index'
import { saveUserInfo, clearUserInfo } from '@/utils/index'
import axios from 'axios'

//创建axios的一个实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API?.toString(), //接口统一域名
  timeout: 10000 //设置超时
})

//请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    const token = window.localStorage.getItem('token')
    const refreshToken = window.localStorage.getItem('refresh')
    if (-config.url.indexOf('refreshToken') == 1) {
      token && (config.headers.Authorization = token)
    } else {
      refreshToken && (config.headers.refresh = refreshToken)
    }

    //若请求方式为post，则将data参数转为JSON字符串
    if (config.method === 'POST') {
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error)
)

//标志当前是否正在刷洗token
let isNotRefreshing = true
//请求队列
let requests: any[] = []

//响应拦截器
instance.interceptors.response.use(
  async (res) => {
    //我们可以定义一个标准响应体，比如：{code=403,msg='token已过期',data:null}，当收到token过期的响应就要进行token刷新了
    if (res.data.code === 403) {
      //首先拿到响应的配置参数，这和请求的配置参数是一样的，包括了url、data等信息，待会需要使用这个config来进行重发
      const config = res.config
      //如果当前不处于刷新阶段就进行刷新操作
      if (isNotRefreshing) {
        isNotRefreshing = false
        //返回刷新token的回调的返回值，本来考虑到由于请求是异步的，所以return会先执行，导致返回一个undefined，那么就需要使用async+await，但实际上没有加也成功了
        return instance
          .get(`${import.meta.env.VITE_APP_BASE_API}/h5/space/user/refreshToken`)
          .then((res: any) => {
            //如果token无效或token仍然过期，就只能重新登录了
            if (res.code === 403 || res.code === 404) {
              console.log('token无效或token仍然过期')
              clearUserInfo()
              const router = useRouter()
              router.replace('/space/login')
              console.log('refresh失效,我要去登录')
            } else if (res.code === 0) {
              console.log('刷新成功之后，将新的token存起来')
              //刷新成功之后，将新的token存起来
              const userInfo: userInfoInterface = JSON.parse(localStorage.getItem('userInfo') || '')
              saveUserInfo(userInfo, res.token, res.refresh)
              //执行requests队列中的请求，（requests中存的不是请求参数，而是请求的Promise函数，这里直接拿来执行就好）
              requests.forEach((run) => run())
              //将请求队列置空
              requests = []
              //重新执行当前未执行成功的请求并返回
              return instance(config)
            } else {
              clearUserInfo()
              const router = useRouter()
              router.replace('/space/login')
              console.log('莫名其妙,我要去登录')
            }
          })
          .catch(() => {
            clearUserInfo()
            const router = useRouter()
            router.replace('/space/login')
            console.log('请求失败,我要去登录')
          })
          .finally(() => {
            console.log('finally')
            isNotRefreshing = true
          })
      } else {
        //如果当前已经是处于刷新token的状态，就将请求置于请求队列中，这个队列会在刷新token的回调中执行，由于new关键子存在声明提升，所以不用顾虑会有请求没有处理完的情况，这段添加请求的程序一定会在刷新token的回调执行之前执行的
        return new Promise((resolve) => {
          //这里加入的是一个promise的解析函数，将响应的config配置对应解析的请求函数存到requests中，等到刷新token回调后再执行
          requests.push(() => {
            resolve(instance(config))
          })
        })
      }
    } else {
      if (res.data.code == 0) {
        return res.data
      } else {
        if (res.data.code == 404) {
          clearUserInfo()
          const router = useRouter()
          router.replace('/space/login')
          console.log('第一次404,我要去登录了')
        }
        console.log(res.data.code)
        return res.data
      }
    }
  },
  (error) => {
    //响应错误
    if (error.response && error.response.status) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default instance
