export var KEYCLOAK_SUCCESS = 'KEYCLOAK SUCCESS';
export var KEYCLOAK_USER_LOGOUT = 'KEYCLOAK USER LOGOUT';


export function keycloakSuccess(payload) {
    return {
        type: KEYCLOAK_SUCCESS,
        payload
    }
}

export function keycloakLogout() {
    return {
        type: KEYCLOAK_USER_LOGOUT
    }
}