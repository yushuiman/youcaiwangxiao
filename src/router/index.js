import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { showHeader: true }
    },
    {
      path: '/class',
      name: 'class',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Class/Class.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/classDetail',
      name: 'classDetail',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Class/ClassDetail.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/classVideo',
      name: 'classVideo',
      component: () => import('@/views/Video/Video.vue'),
      meta: {
        showHeader: false,
        showFooter: false
      }
    },
    {
      path: '/question',
      name: 'question',
      component: () => import('@/views/Question/Question.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/dopotic',
      name: 'dopotic',
      component: () => import('@/views/Question/DoPotic.vue'),
      meta: {
        showHeader: true,
        showFooter: false
      }
    },
    // ResultReport
    {
      path: '/resultReport',
      name: 'resultReport',
      component: () => import('@/views/Question/ResultReport.vue'),
      meta: {
        showHeader: true,
        showFooter: false
      }
    },
    {
      path: '/answer',
      name: 'answer',
      component: () => import('@/views/Answer/Answer.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/zhibo',
      name: 'zhibo',
      component: () => import('@/views/Zhibo/Zhibo.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/zixun',
      name: 'zixun',
      component: () => import('@/views/Zixun/Zixun.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/views/App/App.vue'),
      meta: { showHeader: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Login.vue'),
      meta: { showHeader: true }
    }
  ]
})
