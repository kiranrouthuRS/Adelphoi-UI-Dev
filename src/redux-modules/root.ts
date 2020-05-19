import { combineReducers } from 'redux';

import { clientReducer } from "./client";
import { programReducer } from "./program";
import { locationReducer } from "./location";
import {referralReducer} from "./referral";
import { userReducer } from './user';
import { usersReducer } from './users';

export const rootReducer = combineReducers({
  client: clientReducer,
  referral: referralReducer,
  program: programReducer,
  programLocation: locationReducer,
  user: userReducer,
  users: usersReducer
});
 
export type AppState = ReturnType<typeof rootReducer>;
