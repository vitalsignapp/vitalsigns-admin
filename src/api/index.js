import axios from "axios";
import { Cookies } from 'quasar';

const host = process.env.API_HOST;
const httpClient = axios.create({ baseURL : host });

httpClient.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get("access-token");
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export function login({email, password}) {
  const url = `${host}/login`;
  return axios.post(url, { email: email, password: password })
    .then(response => {
      if (response.data) {
        return axios.get(`${host}/auth`).then(res => {
          Cookies.set('access-token', res.data.token, {expires: '1M'}); //expired 15 minutes
          return response.data;
        });
      }
    }).catch(handleError);
}

export function listRoom(hospitalId) {
  const url = `/ward/${hospitalId}`;
  return httpClient.get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function listPatient(hospitalId) {
  const url = `/patient/hospital/${hospitalId}`;
  return httpClient.get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function listPatientsByRoomKey(patientRoomKey) {
  const url = `/ward/${patientRoomKey}/patients`;
  return httpClient.get(url)
    .then(response => response.data)
    .catch(handleError);
}


function handleError(err) {
  const { status, data } = err.response;
  const { message } = data;
  console.error(message);
  return Promise.reject({ status, message })
}
