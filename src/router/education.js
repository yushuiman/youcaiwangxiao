const Education = r => require.ensure([], () => r(require('@/views/Education/Education')), 'Education')
const EducationDetail = r => require.ensure([], () => r(require('@/views/Education/EducationDetail')), 'EducationDetail')
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
    path: 'education-detail',
    name: 'education-detail',
    component: EducationDetail,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    }
  },
  {
    path: 'learnTips',
    name: 'learnTips',
    component: LearnTips,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    }
  }
]
