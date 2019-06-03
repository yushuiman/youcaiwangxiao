import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/class',
      name: 'class',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/Class/Class.vue')
    },
    {
      path: '/question',
      name: 'question',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Question/Question' +
      '.vue')
    },
    {
      path: '/answer',
      name: 'answer',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Answer/Answer' +
      '.vue')
    },
    {
      path: '/zhibo',
      name: 'zhibo',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Zhibo/Zhibo' +
      '.vue')
    },
    {
      path: '/zixun',
      name: 'zixun',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Zixun/Zixun' +
      '.vue')
    },
    {
      path: '/app',
      name: 'app',
      component: () => import(/* webpackChunkName: "about" */ '@/views/App/App' +
      '.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Login/Login' +
      '.vue')
    }
  ]
})
