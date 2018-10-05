import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS
} from "../actions/authentication.actions";

const initialState = {
    loggedIn: false
};

function authentication(state = initialState, action) {
    switch (action.type) {

        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                loggedIn: true
            });

        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                loggedIn: false
            });


        default:
            return state
    }
}

export default authentication;