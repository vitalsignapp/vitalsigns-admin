import { Cookies } from 'quasar';

const routes = [
  {
    path: '/',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/test',
    component: () => import('pages/test.vue'),
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/patient',
        component: () => import('pages/Patient.vue'),
        name: 'patient',
        beforeEnter: guard,
      },
      {
        path: '/room',
        component: () => import('pages/Room.vue'),
        name: 'room',
        beforeEnter: guard,
      },
      {
        path: '/roomdetails/:roomKey',
        component: () => import('pages/RoomDetails.vue'),
        name: 'roomdetails',
        beforeEnter: guard,
      },
      {
        path: '/userlist/',
        component: () => import('pages/UserList.vue'),
        name: 'userlist',
        beforeEnter: guard,
      },
      {
        path: '/about/',
        component: () => import('pages/About.vue'),
        name: 'about',
        beforeEnter: guard,
      },
      {
        path: '/patientDetails/:key/:routeName/:roomKey?',
        component: () => import('pages/PatientDetails.vue'),
        name: 'patientDetails',
        beforeEnter: guard,
      },
      {
        path: '/userData/:key',
        component: () => import('pages/UserData.vue'),
        name: 'userData',
        beforeEnter: guard,
      },
    ],
  },
  {
    path: '/QRCode/:key',
    component: () => import('pages/PrintQRCode.vue'),
    name: 'printOnlyOne',
  },
  {
    path: '/QRCode/:key/all',
    component: () => import('pages/PrintQRCode.vue'),
    name: 'printAll',
  },
];

function guard(to, from, next) {
  if (Cookies.get('access-token')) {
    next();
  } else {
    next('/');
  }
}

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
