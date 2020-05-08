import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
// import { createSelector } from 'reselect';

import createReducer from "./createReducer";
import UserState from "./definitions/UserState";
import { AppState } from "../redux-modules/root";
import * as Types from "../api/definitions";
import { login } from "../api/api";

export const emptyUser: Types.User = {
  email: "",
  password:"",
  accessToken: "",
  role_type: ""
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
      const response = await login(email,password,domain);
      console.log(response,"response")
      if (response && response.data) {
        const { token,role_type,domain,customer_id } = response.data.response;
        console.log(response.data.response,"response")
        user = {
          email,
          password,
          accessToken: token,
          role_type: role_type
        };
        dispatch(update({ user }));
      }
    };
    
  },

  logout(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch) => {
      dispatch(update({ user: emptyUser }));
      
    };
  }
};

export const selectors = {
  //
};
