import { decamelizeKeys } from 'humps';
import qs from 'qs';
import { AsyncStorage } from "react-native"

export class ApiAuthErr extends  Error {
	constructor(msg) {
		super(`[Base API Auth] ${msg}`);
	}
};

const LOG_API_ENABLED = true;
const LOG_API_RESPONSE = false;

const baseUrl = "https://n3ax21sfk5.execute-api.ap-northeast-1.amazonaws.com/qa/";
// const baseUrl = "https://elvuk0q4td.execute-api.us-east-1.amazonaws.com/dev/api/";
// const baseUrl = process.env.BASE_API;

console.log("BASE URL = ", baseUrl);

// API LOG
const _api_log = (msg, isResponse = false) => {
	if (isResponse && !LOG_API_RESPONSE) {
		return;
	}
	if (LOG_API_ENABLED) {
		if (typeof msg === 'object') {
			console.log("[API LOG: >>> PARAMS:  ", msg);
		} else {
			console.log("[API LOG:  ", msg);
		}
	}
}

const getAccessToken = async () => {
	const accessToken = await AsyncStorage.getItem('userToken')
	// const accessToken  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb2RlIjoibGFWZEVnQnhKOURNMWUwVnNCZzdMMlBub3plUlpZVzJqd3FPIiwic3ViIjozMjgsImlzcyI6Imh0dHA6Ly9hcnRyaWdnZXItZGV2ZWxvcC13b3ctd2ViMS5hcC1ub3J0aGVhc3QtMS5lbGFzdGljYmVhbnN0YWxrLmNvbS9hcGkvc2lnbmluIiwiaWF0IjoxNTQyMTg3MjQ4LCJleHAiOjE1NDk5NjMyNDgsIm5iZiI6MTU0MjE4NzI0OCwianRpIjoiYnRnWV2BGYjJVWmhzekhMcCJ9.swpuaQAtXq8gXwOXSNCk6AUS5o4E7-ZMo4AacxeCK-k'
	// const accessToken = 'xxxxx'
	return accessToken;
}

// load Token from local storage

const mergeTokenToParams = async (params) => {
	const token = await getAccessToken();
	_api_log(`>>> TOKEN: , ${token}`);
	// return default params with no-token exist or param is null
	if (!token || !params) return params;
	// merge token to param object
	return {
		accessToken: token,
		...params
	};
}

const getFormData = (body) => {
	let formData = new FormData()

	for (let key in body) {
    formData.append(key, body[key]);
  }

	return formData
}

export const apiUrlFor = (endpoint) => {
	return baseUrl + endpoint
}

//HEADER
const checkLogin = () => {
	return true
}

export const headers = async (isFormData = false) => {
	let header
	if (checkLogin()) {
		header = {
			'Authorization': `Bearer ${await getAccessToken()}`,
			// 'access-token': sessionStorage.getItem('access_token'),
			// 'client': sessionStorage.getItem('client'),
			// 'uid': sessionStorage.getItem('uid'),
			'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
		}

		return header
	} else {
		header = {
			// 'Authorization':'Basic c2hhcmV0b3duOkgjZDE1NzFM',
			'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
		}
		return header
	}
}

//METHOD
export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

// BASE CALL API
/** params, body passed to this function should be Object with key is camelcase 
 * for example: { fullName: "abc"}, this func will auto decamleize 
 * param and body object to format like: { full_name: "abc" } before call api
 */
const _callApi = async (endpoint, method, params, pathParam, body, auth = true, isFormData = false) => {

	
	_api_log(`>>> CALL: ,[${method}] ${endpoint}`);
	const url = apiUrlFor(endpoint);
	_api_log(params)
	_api_log(`>>> BODY: , ${body}`);

	/** merge local token */
	let headerContent = await headers(isFormData)

	// const paramsWithToken = await mergeTokenToParams(params);
	// const decamelizedParams = decamelizeKeys(paramsWithToken);
	// const paramsWithTokenPath = await AsyncStorage.getItem('userToken');
	// const accessToken = {
	// 	"access_token": paramsWithTokenPath,
	// };
	// const encodedQueryUrl = pathParam ? `${url}/${pathParam}?${qs.stringify(accessToken)}` : `${url}?${qs.stringify(decamelizedParams)}`;
	const encodedQueryUrl = pathParam ? `${url}/${pathParam}?${qs.stringify(params)}` : url;

	// const decamelizedBody = decamelizeKeys(body);
	// const encodedBody = JSON.stringify(decamelizedBody);
	let encodedBody = {}
	if (isFormData) {
		encodedBody = getFormData(body)
	} else {
		encodedBody = JSON.stringify(body);
	}

	return new Promise((resolve, reject) => {
		_api_log(`>>> FETCH STARTED -> ${encodedQueryUrl} `);
		fetch(encodedQueryUrl, {
			method: method,
			headers: headerContent,
			body: encodedBody
		})
			.then(response => {
				_api_log(`>>> FETCH OK -> ${endpoint} `);
				_api_log(`>>> FETCH STATUS: ${response.status} -> ${endpoint} `);
				return response;
			})
			.then((response) => response.json())
			.then((res) => {
				_api_log(`>>> FETCH JSON -> ${endpoint}: \n`);
				try {
					_api_log(`>>> ${JSON.stringify(res, null, " ")}`, true);
				}
				catch (e) { 

				}
				if (res.error && res.error.startsWith("token_")) {
					_api_log(">>> Auth Err - Invalid Token " + res.error);
					throw new ApiAuthErr(res.error);
				}

				_api_log(`>>> FETCH JSON END ${endpoint} \n`);
				resolve(res);
			})
			.catch((error) => {
				_api_log(`>>> FETCH ERROR -> ${endpoint}: \n`);
				_api_log(`>>> FETCh ERROR INSTANCE TYPE: ${error instanceof ApiAuthErr}`);
				_api_log(`>>> ${error}`);
				_api_log(`>>> FETCH ERROR END ${endpoint} \n`);
				_api_log(`>>> ERROR DETAILS ${error} \n`);
				reject({
					error,
					isSuccess: false,
					data: {}
				});
			});
	});
}

// CALL GET
export function callGetApi(endpoint, params, pathParam) {
	return _callApi(endpoint, GET, params, pathParam);
}

// CALL POST
export function callPostApi(endpoint, body) {
	return _callApi(endpoint, POST, null, null, body);
}

// UPLOAD VIA FORM DATA
export function callUpload(endpoint, body) {
	return _callApi(endpoint, POST, null, null, body, true, true);
}

// CALL PUT
export function callPutApi(endpoint, body, pathParam) {
	return _callApi(endpoint, PUT, null, pathParam, body);
}

// CALL DEL
export function callDeleteApi(endpoint, body, pathParam) {
	return _callApi(endpoint, DELETE, null, pathParam, body);
}

// CALL AUTH (POST)
export function callAuthApi(endpoint, body) {
	return _callApi(endpoint, POST, null, null, body, false);
}