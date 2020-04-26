import { Cookies } from 'quasar';
import { $axios } from '@/boot/axios';

export function login({ email, password, hospitalKey }) {
  const url = `/login`;
  return $axios
    .post(url, { email: email, password: password, hospitalKey: hospitalKey })
    .then(response => {
      const data = response.data;
      if (data.data && data.token) {
        Cookies.set('access-token', data.token);
        return data.data;
      }
      throw 'unauthorized';
    })
    .catch(handleError);
}

export function logout() {
  const url = `/logout`;
  return $axios
    .get(url)
    .then(() => Cookies.remove('access-token'))
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

export function deletePatientById(patientID) {
  const url = `/patient/${patientID}`;
  return $axios
    .delete(url)
    .then(response => response.data)
    .catch(handleError);
}

export function deletePatientLogById(patientID) {
  const url = `/patient/${patientID}/log`;
  return $axios
    .delete(url)
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

export function changePassword(userId, password, confirmPassword) {
  const url = `/userData/reset/${userId}`;
  return $axios
    .put(url, { password, confirmPassword })
    .then(response => response.data)
    .catch(handleError);
}

export function addRoom(data) {
  const url = `/ward`;
  return $axios
    .post(url, data)
    .then(response => response.data)
    .catch(handleError);
}

export function updateHospitalConfig(data) {
  const url = `/hospital`;
  return $axios
    .post(url, data)
    .then(response => response.data)
    .catch(handleError);
}

export function setPatientRead(patientId, isRead) {
  const url = `/patient/${patientId}/status`;
  return $axios
    .patch(url, { isRead })
    .then(response => response.data)
    .catch(handleError);
}

export function setPatientShowNotify(patientId, isNotify) {
  const url = `/patient/${patientId}/status`;
  return $axios
    .patch(url, { isNotify })
    .then(response => response.data)
    .catch(handleError);
}

export function createPatient(data) {
  const url = '/patient';
  return $axios
    .post(url, data)
    .then(response => response.data)
    .catch(handleError)
}

export function updatePatient(data) {
  const url = `/patient/${data.id}`;
  return $axios
    .put(url, data)
    .then(response => response.data)
    .catch(handleError)
}

function handleError(err) {
  console.log(err);
  const { status, data } = err.response;
  const { message } = data;
  console.error(message);
  return Promise.reject({ status, message });
}
