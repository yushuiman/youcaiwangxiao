import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Home = r => require.ensure([], () => r(require('@/views/Home')), 'Home')
const Course = r => require.ensure([], () => r(require('@/views/Course/Course')), 'Course')
const CourseJd = r => require.ensure([], () => r(require('@/views/CourseJd/Course')), 'Course')
const courseDetail = r => require.ensure([], () => r(require('@/views/Course/CourseDetail')), 'courseDetail')
const courseVideo = r => require.ensure([], () => r(require('@/views/Video/Video')), 'courseVideo')
const ceshi = r => require.ensure([], () => r(require('@/views/Video/ceshi')), 'ceshi')
const Question = r => require.ensure([], () => r(require('@/views/Question/Question')), 'Question')
const DoPotic = r => require.ensure([], () => r(require('@/views/Question/DoPotic')), 'DoPotic')
const DoPoticExperience = r => require.ensure([], () => r(require('@/views/Question/DoPoticExperience')), 'DoPoticExperience')
const DoPoticContinue = r => require.ensure([], () => r(require('@/views/Personal/DoPoticContinue')), 'DoPoticContinue')
const DoPoticError = r => require.ensure([], () => r(require('@/views/Personal/DoPoticError')), 'DoPoticError')
const ResultReport = r => require.ensure([], () => r(require('@/views/Question/ResultReport')), 'ResultReport')
const Analysis = r => require.ensure([], () => r(require('@/views/Question/Analysis')), 'Analysis')
const CapacityAssessment = r => require.ensure([], () => r(require('@/views/Question/CapacityAssessment')), 'CapacityAssessment')
const CapacityAssessmentApp = r => require.ensure([], () => r(require('@/views/Question/CapacityAssessmentApp')), 'CapacityAssessmentApp')
const Answer = r => require.ensure([], () => r(require('@/views/Answer/Answer')), 'Answer')
const Login = r => require.ensure([], () => r(require('@/views/Login/Login')), 'Login')
const Personal = r => require.ensure([], () => r(require('@/views/Personal/Personal')), 'Personal')
const News = r => require.ensure([], () => r(require('@/views/News/News')), 'News')
const OrderConfirm = r => require.ensure([], () => r(require('@/views/Orders/OrderConfirm')), 'OrderConfirm')
const OrderPay = r => require.ensure([], () => r(require('@/views/Orders/OrderPay')), 'OrderPay')
const WechatPay = r => require.ensure([], () => r(require('@/views/Orders/WechatPay')), 'WechatPay')

const router = new Router({
  mode: 'history',
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
      path: '/course',
      name: 'course',
      component: Course,
      meta: {
        title: '课程',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/course-jd',
      name: 'CourseJd',
      component: CourseJd,
      meta: {
        title: '课程',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/course-detail',
      name: 'course-detail',
      component: courseDetail,
      meta: {
        title: '课程',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/course-video',
      name: 'course-video',
      component: courseVideo,
      meta: {
        title: '课程',
        showHeader: false,
        showFooter: false,
        showRightSlider: false
      }
    },
    {
      path: '/ceshi',
      name: 'ceshi',
      component: ceshi,
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
      component: Question,
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
      component: DoPotic,
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
      component: DoPoticExperience,
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
      component: DoPoticContinue,
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
      component: DoPoticError,
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
      component: ResultReport,
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
      component: Analysis,
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
      component: CapacityAssessment,
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
      component: CapacityAssessmentApp,
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
      component: Answer,
      meta: {
        title: '答疑',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
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
      component: Personal,
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
      component: News,
      meta: {
        title: '消息',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
      }
    },
    {
      path: '/order-confirm',
      name: 'order-confirm',
      component: OrderConfirm,
      meta: {
        title: '确认订单',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/order-pay',
      name: 'order-pay',
      component: OrderPay,
      meta: {
        title: '订单支付',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: '/wechat-pay',
      name: 'wechat-pay',
      component: WechatPay,
      meta: {
        title: '订单支付',
        showHeader: true,
        showFooter: false,
        showRightSlider: true
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
export default router
