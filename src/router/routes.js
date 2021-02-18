const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', component: () => import('pages/SectionsPage') },
    ],
  },
  {
    path: '/lesson/',
    component: () => import('layouts/MainLayout'),
    children: [
      {
        path: '/lesson/:lessonId',
        name: 'lesson',
        component: () => import('pages/LessonPage'),
        props: true,
      },
    ],
  },
];

export default routes;
