import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
// import { createSelector } from 'reselect';

import createReducer from "./createReducer";
import UserState from "./definitions/UserState";
import { AppState } from "../redux-modules/root";
import * as Types from "../api/definitions";
import { login,Logout } from "../api/api";

export const emptyUser: Types.User = {
  email: "",
  accessToken: "",
  role_type: "",
  user_id:"",
  is_pwd_updated:"",
  logo_path:"",
  is_fully_configured:"",
  is_prediction_available:""
};

const initialState: UserState = {
  user: emptyUser
};

const { reducer, update } = createReducer<UserState>(  
  "User/UPDATE",
  initialState
);
export const userReducer = reducer;

export const actions = {
  update,

  login(
    credential: Types.Credential
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const email = credential.email;
      const password = credential.password;
      const domain = credential.domain;
      let user: Types.User;
    return  await login(email,password,domain)
      .then(response => {
        if(response.status === "success"){
          const { token,role_type,
            user_id,is_pwd_updated,
            logo_path,is_fully_configured,
            is_prediction_available,
            is_suspended } = response.response;
          user = {
            email,
           accessToken: token,
            role_type: role_type,
            user_id: user_id,
            is_pwd_updated: is_pwd_updated,
            logo_path: logo_path,
            is_fully_configured: is_fully_configured,
            is_prediction_available: is_prediction_available === true ? 
                                     is_suspended === true ? false : is_prediction_available 
                                     : is_prediction_available
          }
          dispatch(update({ user })); 
        }
        return response;
      })
      
      
    };
    
  },
  
  logout(accessToken:any): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      return  await Logout(accessToken)
      .then(response => {
          dispatch(update({ user: emptyUser })); 
        }
       
      )
      
      
    };
    
  },
//   logout(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
//    return async (dispatch,getState) => {
//     return  await Logout()
//     dispatch(update({ user: emptyUser }));
  
//      };
//   }
 };

export const selectors = {
  //
};