import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import createReducer from "./createReducer";
import { NotificationState } from "./definitions/State";
import { AppState } from "./root";
import * as Types from "../api/definitions";
import { fetchAllNotifications } from "../api/api";

const initialState: NotificationState = {
  pendingList: [],
  pcrList: [],
  rocList: []
};

const { reducer, update } = createReducer<NotificationState>(
  "Notification/UPDATE",
  initialState
);
export const notificationReducer = reducer;

export const actions = {
  update,

  getPendingNotifications(accessToken: any,Type: any,startdate: any,enddate: any):  
  ThunkAction<Promise<void>, AppState, null, AnyAction> { 
    return async (dispatch, getState) => {
      const response = await fetchAllNotifications(accessToken, Type, startdate, enddate); 
      // if (!response) {
      //   throw Error("something went wrong getting list of locations");
      // }
      dispatch(update({ pendingList: response }));
    };
  },

  getPCRNotifications(accessToken: any,Type: any,startdate: any,enddate: any): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAllNotifications(accessToken, Type, startdate, enddate);
      // if (!response) {
      //   throw Error("something went wrong getting list of locations");
      // }
      dispatch(update({ pcrList: response }));
    };
  },

  getROCNotifications(accessToken: any,Type: any,startdate: any,enddate: any): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAllNotifications(accessToken, Type, startdate, enddate);
      // if (!response) {
      //   throw Error("something went wrong getting list of locations");
      // }
      dispatch(update({ rocList: response }));
    };
  },

  clear(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(update({ pendingList: [], pcrList: [],rocList: [] }));
    };
  }
};

export const selectors = {
  //
};
