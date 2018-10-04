export var LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export var LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';

export function loginSuccess() {
    return {
        type: LOGIN_SUCCESS
    }
}

export function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    }
}