import {
   USER_SUCCESS
} from "../actions/user.actions";

const initialState = {};

function user(state = initialState, action) {
    switch (action.type) {

        case USER_SUCCESS:
            return Object.assign({}, state, {
                ...action.payload
            });

        default:
            return state
    }
}

export default user;