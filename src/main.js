import Vue from 'vue'
import App from './App'
import router from './router/index'

// 引入Element-UI
import ElementUI from 'element-ui'
// 引入Element-UI的样式
import 'element-ui/lib/theme-chalk/index.css'

// 使用element-ui插件
Vue.use(ElementUI)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
