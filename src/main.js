// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入样式
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import App from './App'
import router from './router'
// 引入axios
import axios from 'axios'
// 引入moment
import moment from 'moment'
// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import ElementUI from 'element-ui'
// 使用element-ui
Vue.use(ElementUI)
// 使用插件
Vue.use(VueQuillEditor)

// 设置axios请求拦截
axios.interceptors.request.use(function (config) {
  // 在发送请求之前配置baseURL和headers
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('myToken')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 给Vue原型加上axios事件
Vue.prototype.axios = axios
// axios默认设置
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')
Vue.config.productionTip = false
Vue.filter('dataFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: `<App></App>`,
  components: { App }
})
