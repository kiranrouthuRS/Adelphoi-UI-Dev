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
  searchDClient,
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
   clientList: {},
   searchData: {},
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

searchDClient(
    client_code: string,
    client_name: string,
    is_accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await searchDClient(client_code, client_name, is_accessToken);
      const arr = response.response;
     let clientList: { [key: string]: any } = {};
      arr&&arr.map((c: any) => {
        if (c.client_code) {
          return (clientList[c.client_code] = c.sections);  
        }
        return null;
      });
      dispatch(update({ clientList,  searchData: response.response })); 
      return;
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
        return await insertDClient(Dclient,is_accessToken)
        .then(response => {
          const cl = {
            ...Dclient,
            // program_type: response.program_type || null,
            // Confidence: response.Confidence || null,
            // Roc_confidence: response.Roc_confidence || null,
            // referred_program: response.program_type || null,
            // model_program: response.model_program || null,
            // SuggestedPrograms: response.list_program_types || null
          };
          // dispatch(update({ client: cl }));
          // updatedDClient = cl; 
           return response.data.response?response.data.response:response.data.message;
        })  
        
      } 
      catch (errors) {
        // const client :any ={ response: "failed"}
         dispatch(update({  errors: errors })); 
        throw errors;
        console.log(errors)
        return errors;
      }
      
    };
  },


};
