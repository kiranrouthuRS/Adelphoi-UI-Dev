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
  getPCRAnalytics(
    filter: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchPCRAnalytics(filter);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ PCRAnalyticsList: response }));  
    };
  },
  getROCAnalytics(
    filter: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchROCAnalytics(filter);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ROCAnalyticsList: response })); 
    };
  },
  getReplacementAnalytics(
    filter: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchReplacementAnalytics(filter);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ReplacementList: response })); 
    };
  },
  getStayAnalytics(
    filter: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchStayAnalytics(filter);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ StayList: response })); 
    };
  },
  getOccupancyAnalytics(
    filter: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchOccupancyAnalytics(filter);
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
      const response = await fetchDateAnalytics(analytics);
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
