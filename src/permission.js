import router from '@/router'
import store from '@/store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 白名单
const whiteList = ['/login', '/404']
// to去哪 from 来自哪里 next 放行
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度条效果
  Nprogress.start()
  // 权限控制
  const token = store.getters.token
  if (token) {
    // 如果登陆过，就不能再去登录了，直接让去后台首页
    if (to.path === '/login') {
      next('/')
      Nprogress.done()
    } else {
      if (!store.getters.userInfo.id) {
        // 当用户手里有token，并且访问的不是登录页面，那就请求个人资料
        store.dispatch('user/getInfo')
      }
      next()// 放行
    }
  } else {
    // 如果没有token
    // 但是在白名单里，就放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 否则就去登录
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  Nprogress.done()
})
