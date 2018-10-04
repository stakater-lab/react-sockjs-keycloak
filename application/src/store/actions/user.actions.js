export var USER_SUCCESS = 'USER_SUCCESS'

export function userSuccess(payload) {
    return {
        type: USER_SUCCESS,
        payload: payload
    }
}