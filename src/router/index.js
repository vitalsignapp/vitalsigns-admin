import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

var firebaseConfig = {
  apiKey: "AIzaSyDkfuz9optU8t14BZJBgJ9JNYdH4Omdh6A",
  authDomain: "vitalsign-2bc48.firebaseapp.com",
  databaseURL: "https://vitalsign-2bc48.firebaseio.com",
  projectId: "vitalsign-2bc48",
  storageBucket: "vitalsign-2bc48.appspot.com",
  messagingSenderId: "67633726727",
  appId: "1:67633726727:web:b535d92a91ec80695bb1a2",
  measurementId: "G-MEX9V112SR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();


export default function ( /* { store, ssrContext } */ ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
