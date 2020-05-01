import { combineReducers } from 'redux';

import { clientReducer } from "./client";
import { programReducer } from "./program";
import { locationReducer } from "./location";
import {referralReducer} from "./referral";
import { userReducer } from './user';

export const rootReducer = combineReducers({
  client: clientReducer,
  referral: referralReducer,
  program: programReducer,
  programLocation: locationReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof rootReducer>;
