import Vue from 'vue'
import App from './App'
import router from './router'

// 引入axios
import axios from 'axios'

import ElementUI from 'element-ui'
// 引入样式
import 'element-ui/lib/theme-chalk/index.css'
// 使用element-ui
Vue.use(ElementUI)

// 给Vue原型加上axios事件
Vue.prototype.axios = axios
// axios默认设置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: `<App></App>`,
  components: { App }
})
