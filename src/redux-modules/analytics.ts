import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import createReducer from "./createReducer";
import { AnalyticsState } from "./definitions/State";
import { AppState } from "./root";
import * as Types from "../api/definitions";
import {
  fetchAnalytics,
  fetchDateAnalytics,
  fetchPCRAnalytics,
  fetchROCAnalytics,
  fetchReplacementAnalytics,
  fetchStayAnalytics,
  fetchOccupancyAnalytics
} from "../api/api";

const initialState: AnalyticsState = {
  analyticsList: [],
  PCRAnalyticsList:[],
  ROCAnalyticsList:[],
  ReplacementList: [],
  StayList: [],
  OccupancyList: []
 };

const { reducer, update } = createReducer<AnalyticsState>(
  "analytics/UPDATE",
  initialState
);
export const analyticsReducer = reducer;

export const actions = {
  update,

  getAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ analyticsList: response })); 
    };
  },
  getPCRAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchPCRAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ PCRAnalyticsList: response }));  
    };
  },
  getROCAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchROCAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ROCAnalyticsList: response })); 
    };
  },
  getReplacementAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchReplacementAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ReplacementList: response })); 
    };
  },
  getStayAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchStayAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ StayList: response })); 
    };
  },
  getOccupancyAnalytics(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchOccupancyAnalytics();
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ OccupancyList: response }));  
    };
  },
  getDateAnalytics(
    analytics: Types.Analytics
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
        console.log(analytics)
      const response = await fetchDateAnalytics(analytics);
     console.log(response)
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ analyticsList: response })); 
      return;
    };
  },
 
  clear(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(update({ analyticsList: [] }));
    };
  }
};

export const selectors = {
  //
};
