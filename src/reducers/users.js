import {
    CREATE_USER,
    USER_LOGIN,
    UPDATE_USER,
    RECEIVED_USER_DATA,
    RECEIVED_USER_DATA_FAILED,
  } from 'src/constants/action-types';
  import { UNKNOWN_ERROR, NO_CODE } from 'src/constants/error-codes'
  
  const DEFAULT_STATE = {
      error: null,
      errorCode: NO_CODE,
    data: {},
    loading: false,
  }
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type) {
          case CREATE_USER:
              return {
                  ...state,
                  loading: true
              }
          case UPDATE_USER:
              return {
                  ...state,
                  loading: true
              }
          case USER_LOGIN:
              return {
                  ...state,
                  loading: true
              }
          case RECEIVED_USER_DATA:
              return {
                  ...state,
                  error: action.payload.error,
                  errorCode: action.payload.errorCode || NO_CODE,
                  data: action.payload.data || {},
                  loading: false,
        }
      case RECEIVED_USER_DATA_FAILED:
        return {
          ...state,
                  error: 'something went wrong!',
                  errorCode: UNKNOWN_ERROR,
          data: {},
          loading: false,
        }
          default:
              return state;
      }
  }
  