import axios from "axios";

const host = process.env.API_HOST;
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export function login({email, password}) {
  const url = `${host}/login`;
  return axios.post(url, 
    {
      email: email, 
      password: password
    })
    .then(response => response.data)
    .catch(handleError);
}

export function listRoom(hospitalId) {
  const url = `${host}/ward/${hospitalId}`;
  return axios.get(url, { withCredentials: true })
    .then(response => response.data)
    .catch(handleError);
}


function handleError(err) {
  const { status, data } = err.response;
  const { message } = data;
  return Promise.reject({ status, message })
}
