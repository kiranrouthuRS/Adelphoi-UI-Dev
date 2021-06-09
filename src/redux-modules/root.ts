import { combineReducers } from 'redux';
import { clientReducer } from "./client";
import { programReducer } from "./program";
import { locationReducer } from "./location";
import { referralReducer } from "./referral";
import { analyticsReducer } from "./analytics";
import { notificationReducer } from "./notifications"
import { userReducer } from './user';
import { usersReducer } from './users';
import { dynamicclientReducer } from './dynamicclient'

export const rootReducer = combineReducers({
  client: clientReducer,
  referral: referralReducer,
  analytics: analyticsReducer,
  notifications: notificationReducer,
  program: programReducer, 
  programLocation: locationReducer,
  user: userReducer,
  users: usersReducer,
  dynamicclient: dynamicclientReducer, 
});
export type AppState = ReturnType<typeof rootReducer>;
