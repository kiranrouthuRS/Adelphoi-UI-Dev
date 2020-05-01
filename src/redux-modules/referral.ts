import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import createReducer from "./createReducer";
import { ReferralState } from "./definitions/State";
import { AppState } from "./root";
import * as Types from "../api/definitions";
import {
  fetchReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  fetchAvailableReferral
} from "../api/api";

const initialState: ReferralState = {
  referralList: [],
  availableReferralList: []
};

const { reducer, update } = createReducer<ReferralState>(
  "referral/UPDATE",
  initialState
);
export const referralReducer = reducer;

export const actions = {
  update,

  getReferral(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchReferral();
      if (!response) {
        throw Error("something went wrong getting list of referral");
      }
      dispatch(update({ referralList: response }));
    };
  },

  getAvailableReferral(): ThunkAction<
    Promise<void>,
    AppState,
    null,
    AnyAction
  > {
    return async (dispatch, getState) => {
      const response = await fetchAvailableReferral();
      if (!response) {
        throw Error("something went wrong getting list of available referral");
      }
      dispatch(update({ availableReferralList: response }));
    };
  },

  createReferral(
    referral: Types.Referral
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await createReferral(referral);
      if (!response) {
        throw Error("something went wrong while creating the referral");
      }
      const newReferral: Types.Referral = {
        referral_code: response.referral_id,
        referral_name: referral.referral_name
      };
      const referralState = getState().referral;
      const existingList = referralState ? referralState.referralList : [];
      const referralList = [newReferral, ...existingList];
      dispatch(update({ referralList }));
    };
  },

  updateReferral(
    referral: Types.Referral
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await updateReferral(referral);
      if (!response) {
        throw Error("something went wrong while updating the referral");
      }
      const referralState = getState().referral;
      let existingList = referralState ? referralState.referralList : [];
      if (existingList.length > 0) {
        existingList = existingList.filter(
          p => p.referral_code !== referral.referral_code
        );
      }
      const referralList = [referral, ...existingList];
      dispatch(update({ referralList }));
    };
  },
  deleteReferral(
    referral: Types.Referral
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await deleteReferral(referral);
      if (!response) {
        throw Error("something went wrong while updating the referral");
      }
      const referralState = getState().referral;
      let existingList = referralState ? referralState.referralList : [];
      if (existingList.length > 0) {
        existingList = existingList.filter(
          p => p.referral_code !== referral.referral_code
        );
      }
      const referralList = [...existingList];
      dispatch(update({ referralList }));
    };
  },
  clear(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(update({ referralList: [] }));
    };
  }
};

export const selectors = {
  //
};
