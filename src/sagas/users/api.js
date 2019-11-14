import { callPostApi, callGetApi, callPutApi, callUpload } from 'src/helpers/apis'

export function createUsers(data = null) {
  if (!data) return
  const endpoint = 'users/create';
  return callPostApi(endpoint, data);
}

export function updateUsers(data = null) {
  if (!data) return
  const endpoint = 'users/update';
  return callPutApi(endpoint, data);
}

export function updateUserAvatar(data = null) {
  if (!data) return
  const endpoint = 'api/upload/images/s3';
  return callUpload(endpoint, data);
}

export function userLogin(data = null) {
  if (!data) return
  const endpoint = 'users/login';
  return callPostApi(endpoint, data);
}

export function checkValidate(data = null) {
  if (!data) return
  const endpoint = 'verifications';
  return callGetApi(endpoint, data, 'check');
}