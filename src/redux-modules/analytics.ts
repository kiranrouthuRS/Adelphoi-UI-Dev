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
  fetchOccupancyAnalytics,
  fetchAllocationAnalytics,
  fetchAllocated_ProgramAnalytics,
  fetch_Market_Analytics,
  fetch_Performance_Analytics,
  fetch_Gender_Analytics,
  fetch_Age_Analytics,
  fetch_ROC_Calibration_Analytics,
  fetch_Demo_Analytics,
  fetch_PCR_Calibration_Analytics
} from "../api/api";
import { store } from "../index";
const initialState: AnalyticsState = {
  analyticsList: [],
  PCRAnalyticsList:[],
  ROCAnalyticsList:[],
  ReplacementList: [],
  StayList: [],
  OccupancyList: [],
  AllocationList:[],
  Program_Alloc_List:[],
  Market_Analytics_List:[],
  Performance_Analytics_List:[],
  Gender_List:[],
  Age_List:[],
  ROC_Calibration_List:[],
  Demo_List:[],
  PCR_Calibration_List:[]
 };

const { reducer, update } = createReducer<AnalyticsState>(
  "analytics/UPDATE",
  initialState
);
export const analyticsReducer = reducer;

export const actions = {
  update,

  getAnalytics(accessToken: any): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAnalytics(accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ analyticsList: response })); 
    };
  },
  getPCRAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchPCRAnalytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ PCRAnalyticsList: response }));  
    };
  },
  getROCAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchROCAnalytics(filter,accessToken);
     // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ROCAnalyticsList: response })); 
    };
  },
  getReplacementAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchReplacementAnalytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ReplacementList: response })); 
    };
  },
  getStayAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchStayAnalytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ StayList: response })); 
    };
  },
  getOccupancyAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchOccupancyAnalytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ OccupancyList: response }));  
    };
  },
  getAllocationAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAllocationAnalytics(filter,accessToken);
      console.log(response)
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ AllocationList: response }));  
    };
  },
  getMarket_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetch_Market_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Market_Analytics_List: response }));  
    };
  },
  getPerformance_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetch_Performance_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Performance_Analytics_List: response }));  
    };
  },
  getProgram_AllocationAnalytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchAllocated_ProgramAnalytics(filter,accessToken);
      
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Program_Alloc_List: response }));  
    };
  },
  getDateAnalytics(
    analytics: Types.Analytics,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      console.log(analytics)
      const response = await fetchDateAnalytics(analytics,accessToken);
      console.log(response)
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ analyticsList: response })); 
      return;
    };
  },
  get_ROC_Calibration_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetch_ROC_Calibration_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ ROC_Calibration_List: response }));  
    };
  },
  getGender_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetch_Gender_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Gender_List: response }));  
    };
  },
  GetAge_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetch_Age_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Age_List: response }));  
    };
  },
  get_PCR_Calibration_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      
      const response = await fetch_PCR_Calibration_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ PCR_Calibration_List: response }));  
    };
  },
  get_Demo_Analytics(
    filter: any,
    accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      
      const response = await fetch_Demo_Analytics(filter,accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of analytics");
      // }
      dispatch(update({ Demo_List: response }));  
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
