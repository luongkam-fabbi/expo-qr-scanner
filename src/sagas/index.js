import { all } from 'redux-saga/effects'

import UserSaga from './users';
function* rootSaga() {
	yield all([
		...UserSaga,
	]);
}
export default rootSaga;
