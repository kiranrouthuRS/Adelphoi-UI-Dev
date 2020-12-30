import { combineReducers } from 'redux';
import { AnyAction } from "redux";
import { clientReducer } from "./client";
import { programReducer } from "./program";
import { locationReducer } from "./location";
import { referralReducer } from "./referral";
import { analyticsReducer } from "./analytics";
import { userReducer } from './user';
import { usersReducer } from './users';
import { dynamicclientReducer } from './dynamicclient'

export const rootReducer = combineReducers({
  client: clientReducer,
  referral: referralReducer,
  analytics: analyticsReducer,
  program: programReducer,
  programLocation: locationReducer,
  user: userReducer,
  users: usersReducer,
  dynamicclient: dynamicclientReducer, 
});
// export const appReducer = combineReducers({
//   client: clientReducer,
//   referral: referralReducer,
//   analytics: analyticsReducer,
//   program: programReducer,
//   programLocation: locationReducer,
//   user: userReducer,
//   users: usersReducer,
//   dynamicclient: dynamicclientReducer,  
// });

// export const rootReducer = (
//   state: ReturnType<typeof appReducer>,
//   action: AnyAction
// ) => {
// /* if you are using RTK, you can import your action and use it's type property instead of the literal definition of the action  */
//   if (action.type === "LOGOUT") {
//     return appReducer(undefined, { type: undefined });
//   }

//   return appReducer(state, action);
// };

export type AppState = ReturnType<typeof rootReducer>;
