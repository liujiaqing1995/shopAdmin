import Vue from 'vue'
import Router from 'vue-router'
// 引入Login.vue组件
import Login from '@/components/Login'
// 引入Home.vue组件
import Home from '@/components/Home'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '/home',
      component: Home,
      name: 'home'
    }
  ]
})
