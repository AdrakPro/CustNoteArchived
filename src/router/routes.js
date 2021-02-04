const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', component: () => import('pages/SectionsPage') },
    ],
  },
  {
    path: '/notes/',
    component: () => import('layouts/MainLayout'),
    children: [
      {
        path: '/notes/:lessonTitle',
        name: 'notes',
        component: () => import('pages/NotesPage'),
        props: true,
      },
    ],
  },
];

export default routes;
