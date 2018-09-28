import {
  combineReducers
} from 'redux';

import authentication from './authentication.reducer';
import user from './user.reducer';
import keycloak from './keycloak.reducer';

export default combineReducers({
  authentication,
  user,
  keycloak
});