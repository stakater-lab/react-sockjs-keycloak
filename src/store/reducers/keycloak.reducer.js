import {
    KEYCLOAK_SUCCESS,
    KEYCLOAK_USER_LOGOUT
} from '../actions/keycloak.actions';

const initialState = {};

function keycloak(state = initialState, action) {

    switch (action.type) {
        case KEYCLOAK_SUCCESS:
            return Object.assign({}, state, {
                ...action.payload
            })

        case KEYCLOAK_USER_LOGOUT:
            return Object.assign({}, state, {})

        default:
            return state;
    }
}

export default keycloak;