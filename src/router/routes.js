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
      },
      {
        path: '/room',
        component: () => import('pages/Room.vue'),
        name: 'room',
      },
      {
        path: '/roomdetails/:roomKey',
        component: () => import('pages/RoomDetails.vue'),
        name: 'roomdetails',
      },
      {
        path: '/userlist/',
        component: () => import('pages/UserList.vue'),
        name: 'userlist',
      },
      {
        path: '/about/',
        component: () => import('pages/About.vue'),
        name: 'about',
      },
      {
        path: '/patientDetails/:key/:routeName/:roomKey?',
        component: () => import('pages/PatientDetails.vue'),
        name: 'patientDetails',
      },
      {
        path: '/userData/:key',
        component: () => import('pages/UserData.vue'),
        name: 'userData',
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

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
