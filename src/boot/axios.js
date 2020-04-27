import Vue from 'vue';
import axios from 'axios';
import config from '@/config/environment';
import { Cookies } from 'quasar';

const $axios = axios.create({
  baseURL: config.API_HOST,
  withCredentials: true,
});

$axios.interceptors.request.use(async config => {
  const accessToken = Cookies.get('access-token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

Vue.prototype.$axios = $axios;

export default { $axios };

export { $axios };
