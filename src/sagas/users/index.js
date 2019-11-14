import { put, takeEvery } from 'redux-saga/effects'
import * as callApi from './api'
import {
  CREATE_USER,
  UPDATE_USER,
  USER_LOGIN,
  RECEIVED_USER_DATA,
  RECEIVED_USER_DATA_FAILED,
} from './action-types'

function* createUsers(action) {
	try {
		const results = yield callApi.createUsers(action.payload)

		yield put({
			type: RECEIVED_USER_DATA,
			payload: results,
		})
	} catch (error) {
		yield put({
			type: RECEIVED_USER_DATA_FAILED,
		})
	}
}

function* updateUsers(action) {
	try {
		const results = yield callApi.updateUsers(action.payload)
		
		if (action.payload.avatarURI) {
			yield callApi.updateUserAvatar({id: action.payload.id, fileUpload: {uri: action.payload.avatarURI.uri, name: action.payload.avatarURI.name, type: 'image/jpeg'}})
		}

		yield put({
			type: RECEIVED_USER_DATA,
			payload: results,
		})
	} catch (error) {
		yield put({
			type: RECEIVED_USER_DATA_FAILED,
		})
	}
}

function* userLogin(action) {
	try {
		const results = yield callApi.userLogin(action.payload)

		yield put({
			type: RECEIVED_USER_DATA,
			payload: results,
		})
	} catch (error) {
		yield put({
			type: RECEIVED_USER_DATA_FAILED,
		})
	}
}

export default UserSaga = [
	takeEvery(CREATE_USER, createUsers),
	takeEvery(USER_LOGIN, userLogin),
	takeEvery(UPDATE_USER, updateUsers),
];
