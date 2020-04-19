import { Cookies } from 'quasar';
import { $axios } from '@/boot/axios';

export function login({ email, password }) {
  const url = `/login`;
  return $axios
    .post(url, { email: email, password: password })
    .then(response => {
      if (response.data) {
        return $axios.get(`/auth`).then(res => {
          Cookies.set('access-token', res.data.token, { expires: '1M' }); //expired 15 minutes
          return response.data;
        });
      }
    })
    .catch(handleError);
}

export function listRoom(hospitalId) {
  const url = `/ward/${hospitalId}`;
  return $axios
    .get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function listPatient(hospitalId) {
  const url = `/patient/hospital/${hospitalId}`;
  return $axios
    .get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function listPatientsByRoomKey(patientRoomKey) {
  const url = `/ward/${patientRoomKey}/patients`;
  return $axios
    .get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function getPatientDetailById(patientID) {
  const url = `/patient/${patientID}`;
  return $axios
    .get(url)
    .then(response => response.data)
    .catch(handleError);
}

export function getPatientLogById(patientID) {
  const url = `/patient/${patientID}/log`;
  return $axios
    .get(url)
    .then(response => response.data)
    .catch(handleError);
}

function handleError(err) {
  const { status, data } = err.response;
  const { message } = data;
  console.error(message);
  return Promise.reject({ status, message });
}
