import Vue from 'vue'
// 第三方css库 让不同的浏览器标签渲染效果一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon svg图标
import '@/permission' // permission control 权限控制

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false
// 批量导入自定义指令 作用可以简化指令写法
// 可以把所有的按需导出的全部导入到一个对象中
import * as directives from '@/directives'
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

import mixins from '@/mixins'
Vue.mixin(mixins)

import components from './components'
// 打印的插件
import Print from 'vue-print-nb'
// Global instruction
import TagsView from '@/components/TagsView'
Vue.component('TagsView', TagsView)
import i18n from '@/lang'
Vue.use(Print)
Vue.use(components)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
