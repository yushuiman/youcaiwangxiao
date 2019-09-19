import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
// import store from '@/store/'
// import { getToken } from '@/libs/utils'
import {
} from '@/api/login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/class',
      name: 'class',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Class/Class.vue'),
      meta: {
        title: '课程',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/class-detail',
      name: 'class-detail',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Class/ClassDetail.vue'),
      meta: {
        title: '课程',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/class-video',
      name: 'class-video',
      component: () => import('@/views/Video/Video.vue'),
      meta: {
        title: '课程',
        showHeader: false,
        showFooter: false,
        showRightSlider: false
      }
    },
    {
      path: '/question',
      name: 'question',
      component: () => import('@/views/Question/Question.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/dopotic',
      name: 'dopotic',
      component: () => import('@/views/Question/DoPotic.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/dopotic-experience',
      name: 'dopotic-experience',
      component: () => import('@/views/Question/DoPoticExperience.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/dopotic-continue',
      name: 'dopotic-continue',
      component: () => import('@/views/Personal/DoPoticContinue.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/dopotic-error',
      name: 'dopotic-error',
      component: () => import('@/views/Personal/DoPoticError.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/result-report',
      name: 'result-report',
      component: () => import('@/views/Question/ResultReport.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('@/views/Question/Analysis.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/capacity-assessment',
      name: 'capacity-assessment',
      component: () => import('@/views/Question/CapacityAssessment.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/capacity-assessment-app',
      name: 'capacity-assessment-app',
      component: () => import('@/views/Question/CapacityAssessmentApp.vue'),
      meta: {
        title: '题库',
        showHeader: false,
        showFooter: false,
        showRightSlider: false
      }
    },
    {
      path: '/answer',
      name: 'answer',
      component: () => import('@/views/Answer/Answer.vue'),
      meta: {
        title: '答疑',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/zhibo',
      name: 'zhibo',
      component: () => import('@/views/Zhibo/Zhibo.vue'),
      meta: {
        title: '直播',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/zixun',
      name: 'zixun',
      component: () => import('@/views/Zixun/Zixun.vue'),
      meta: {
        title: '资讯',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/views/App/App.vue'),
      meta: {
        title: 'App',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Login.vue'),
      meta: {
        title: '登录',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    // 个人中心
    {
      path: '/personal',
      name: 'personal',
      component: () => import('@/views/Personal/Personal.vue'),
      meta: {
        title: '个人中心',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    // 消息
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/News/News.vue'),
      meta: {
        title: '消息',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    // 学习中心
    {
      path: '/learning-center',
      name: 'learning-center',
      component: () => import('@/views/LearningCenter/LearningCenter.vue'),
      meta: {
        title: '学习中心',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/learning-center-detail',
      name: 'learning-center-detail',
      component: () => import('@/views/LearningCenter/LearningCenterDetail.vue'),
      meta: {
        title: '学习中心',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/dopotic-learn',
      name: 'dopotic-learn',
      component: () => import('@/views/LearningCenter/DoPoticLearn.vue'),
      meta: {
        title: '题库',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/learn-center-video',
      name: 'learn-center-video',
      component: () => import('@/views/LearningCenter/LearnCenterVideo.vue'),
      meta: {
        title: '课程',
        showHeader: false,
        showFooter: false,
        showRightSlider: false
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
// router.beforeEach((to, from, next) => {
//   let token = store.state.user.token
//   if (token) {
//     store.dispatch('getUserInfo').then(() => {
//       store.dispatch('getIndexMessage')
//     })
//     next()
//   } else {
//     next()
//   }
// })
// router.afterEach((to, from, next) => {
//   window.scrollTo(0, 0)
//   next()
// })
export default router
