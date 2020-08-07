import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
// import { createSelector } from 'reselect';

import createReducer from "./createReducer";
import { ClientState,QuestionsState } from "./definitions/State";
import { AppState } from "./root";
import * as Types from "../api/definitions";
import {
  insertDClient,
  updateDClient,
  insertPrediction,
  fetchLocations,
  saveLocationAndProgram,
  searchClient,
  updateProgramCompletion,
  fetchPcr,
  fetchProgramsForClient,
  fetchConfiguredQuestions
} from "../api/api";

// const initialState: ClientState = {
//   client: Types.emptyClient,
//   clientList: {},
//   errors: {},
//   excludePage2: false,
//   page1FormCompleted: false,
//   page2FormCompleted: false
// };
const initialState: QuestionsState = {
   configuredQuestionsList: [],
   client: Types.emptyClient,
   errors: {}
  
  
};
// TODO handle negative cases
// 1. new client creation fails - with and without excl.
// 2. submit prediction responds with error - no program found.
// 3. get locations responds with error - no locations found or empty array.

const { reducer, update } = createReducer<QuestionsState>(
  "Client/UPDATE",
  initialState
);
export const dynamicclientReducer = reducer;

export const actions = {
  update,

  getConfiguredQuestions(is_accessToken:any): ThunkAction<
    Promise<void>,
    AppState,
    null,
    AnyAction
  > {
    return async (dispatch, getState) => {
      const response = await fetchConfiguredQuestions(is_accessToken);
      if (!response) {
        throw Error("something went wrong getting list of available referral");
      }
      dispatch(update({ configuredQuestionsList: response.response }));
    };
  },

insertDClient(
  Dclient:  Types.DynamicClient,
  is_accessToken:any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      let locations: string[] = [];
      let updatedDClient: Types.DynamicClient; 
      try {
        const response = await insertDClient(Dclient,is_accessToken);    
        const cl = {
          ...Dclient,
          // program_type: response.program_type || null,
          // Confidence: response.Confidence || null,
          // Roc_confidence: response.Roc_confidence || null,
          // referred_program: response.program_type || null,
          // model_program: response.model_program || null,
          // SuggestedPrograms: response.list_program_types || null
        };
        dispatch(update({ client: cl }));
        updatedDClient = cl; 
        // return cl;
      } 
      catch (errors) {
        // const client :any ={ response: "failed"}
        //  dispatch(update({ client, errors: errors })); 
        throw errors;
      }
      
    };
  },


};