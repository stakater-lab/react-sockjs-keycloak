import {
  combineReducers
} from 'redux';

import authentication from './authentication.reducer';
import user from './user.reducer';

export default combineReducers({
  authentication,
  user
});