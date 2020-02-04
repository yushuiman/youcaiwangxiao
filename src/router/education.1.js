const Education = r => require.ensure([], () => r(require('@/views/Education/Education')), 'Education')
const Index = r => require.ensure([], () => r(require('@/views/Education/Index')), 'Index')
const Detail = r => require.ensure([], () => r(require('@/views/Education/Detail')), 'Detail')
const LearnTips = r => require.ensure([], () => r(require('@/views/Education/LearnTips')), 'LearnTips')
// {
//   path: '/personsessage',
//   name: 'personsessage',
//   redirect: '/personsessage/identitymessage',
//   component: () => import('@/views/PersonMessage/PersonMessage'),
//   children: [{
//     path: '/personsessage/identitymessage',
//     name: 'IdentityMessage',
//     component: () => import('@/views/PersonMessage/children/IdentityMessage.vue')
//   },
//   {
//     path: '/personsessage/accountmessage',
//     name: 'AccountMessage',
//     component: () => import('@/views/PersonMessage/children/AccountMessage.vue')
//   }
//   ]
// },
export default [
  {
    path: '/education',
    name: 'education',
    redirect: '/education/index',
    component: Education,
    meta: {
      title: '后续教育',
      showHeader: true,
      showFooter: true,
      showRightSlider: true
    },
    children: [{
      path: 'index',
      name: 'index',
      component: Index,
      meta: {
        title: '后续教育',
        showHeader: true,
        showFooter: true,
        showRightSlider: true
      }
    },
    {
      path: 'detail',
      name: 'detail',
      component: Detail,
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
  }
]
