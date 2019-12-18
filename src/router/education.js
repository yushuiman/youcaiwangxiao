const Education = r => require.ensure([], () => r(require('@/views/Education/Education')), 'Education')
const EducationCourseList = r => require.ensure([], () => r(require('@/views/Education/EducationCourseList')), 'EducationCourseList')
const EducationCourseDetail = r => require.ensure([], () => r(require('@/views/Education/EducationCourseDetail')), 'EducationCourseDetail')
const EducationVideo = r => require.ensure([], () => r(require('@/views/Education/EducationVideo')), 'EducationVideo')
const LearnTips = r => require.ensure([], () => r(require('@/views/Education/LearnTips')), 'LearnTips')
export default [
  {
    path: '/education',
    name: 'education',
    component: Education,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    }
  },
  {
    path: '/education-course-list',
    name: 'education-course-list',
    component: EducationCourseList,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    }
  },
  {
    path: '/education-course-detail',
    name: 'education-course-detail',
    component: EducationCourseDetail,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    }
  },
  {
    path: '/education-video',
    name: 'education-video',
    component: EducationVideo,
    meta: {
      title: '后续教育',
      showHeader: false,
      showFooter: false,
      showRightSlider: false
    }
  },
  {
    path: '/learn-tips',
    name: 'learn-tips',
    component: LearnTips,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: false,
      showRightSlider: true
    }
  }
]
