import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import createReducer from "./createReducer";
import { UsersState } from "./definitions/State"; 
import { AppState } from "./root";
import * as Types from "../api/definitions";
import {
  fetchUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  fetchAvailableUsers,
  fetchRoles
} from "../api/api";

const initialState: UsersState = {
  usersList: [],
  availableUsersList: [],
  rolesList:[]
};

const { reducer, update } = createReducer<UsersState>(
  "users/UPDATE",
  initialState
);
export const usersReducer = reducer;

export const actions = {
  update,

  getUsers(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchUsers();
      if (!response) {
        throw Error("something went wrong getting list of users");
      }
      dispatch(update({ usersList: response }));
    };
  },

  getRoles(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
     
      const response = await fetchRoles();
      console.log(response,"fetchroles")
      if (!response) {
        throw Error("something went wrong getting list of roles");
      }
      
      dispatch(update({ rolesList: response }));
    };
  },

  getAvailableUsers(
    userID: any
  ): ThunkAction<
    Promise<void>,
    AppState,
    null,
    AnyAction
  > {
    return async (dispatch, getState) => {
      const response = await fetchAvailableUsers(userID);  
      const users: Types.Users = {
        id: response.id,
        full_name: "",
        name:"",
        first_name:response.first_name,
        last_name:response.last_name,
        email_id:response.email_id,
        mobile:response.mobile,
        gender:response.gender,
        role_type:response.role_type
      };
      if (!response) {
        throw Error("something went wrong getting list of available users");
      }
      dispatch(update({ availableUsersList: response}));
    };
  },

  createUsers(
    users: Types.Users
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await createUsers(users);
      if (!response) {
        throw Error("something went wrong while creating the users");
      }
      const newUsers: Types.Users = {
        id: response.id,
        full_name: users.full_name,
        name:"",
        first_name: users.first_name,
        last_name: users.last_name,
        email_id:users.email_id,
        mobile:users.mobile,
        gender:users.gender,
        role_type:users.role_type
      };
      const usersState = getState().users;
      const existingList = usersState ? usersState.usersList : [];
      const usersList = [newUsers, ...existingList];
      dispatch(update({ usersList }));
      const response1 = await fetchUsers();
      if (!response1) {
        throw Error("something went wrong getting list of users");
      }
      dispatch(update({ usersList: response1 }));
    };
  },

  updateUsers(
    users: Types.Users
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await updateUsers(users);
      if (!response) {
        throw Error("something went wrong while updating the users");
      }
      const usersState = getState().users;
      let existingList = usersState ? usersState.usersList : [];
      if (existingList.length > 0) {
        existingList = existingList.filter(
          p => p.id !== users.id
        );
      }
      const usersList = [users, ...existingList];
      dispatch(update({ usersList }));
      const response1 = await fetchUsers();
      if (!response1) {
        throw Error("something went wrong getting list of users");
      }
      dispatch(update({ usersList: response1 }));
    };
  },
  deleteUsers(
    userID: any,
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
     const response = await deleteUsers(userID);
      if (!response) {
        throw Error("something went wrong while updating the users");
      }
      const usersState = getState().users;
      let existingList = usersState ? usersState.usersList : [];
      if (existingList.length > 0) {
        existingList = existingList.filter(
          p => p.id !== userID 
        );
      }
      const usersList = [...existingList];
      dispatch(update({ usersList }));
      const response1 = await fetchUsers();
      if (!response) {
        throw Error("something went wrong getting list of users");
      }
      dispatch(update({ usersList: response1 }));
    };
  },
  clear(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(update({ usersList: [] }));
    };
  }
};

export const selectors = {
  //
};
