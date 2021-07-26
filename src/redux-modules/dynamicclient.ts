import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
// import { createSelector } from 'reselect';

import createReducer from "./createReducer";
import { ClientState, QuestionsState } from "./definitions/State";
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
 getConfiguredQuestions(is_accessToken: any): ThunkAction<
    Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await fetchConfiguredQuestions(is_accessToken);
      // if (!response) {
      //   throw Error("something went wrong getting list of available referral");
      // }
      dispatch(update({ configuredQuestionsList: response&&response.response }));
      return response.response;  
    };
    
  },

  updateProgramCompletion(
    client_code: string,
    Program_Completion: number | null,
    Returned_to_Care: number | null,
    Remained_Out_of_Care: number | null,
    program_significantly_modified: number,
    program: string | null,
    location: string | null,
    start_date: string | null,
    end_date: string | null,
    referral_status: string | null,
    confidence: number,
    roc_confidence: number
    //is_accessToken: any | null
  ): ThunkAction<Promise<string>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const currentUser = getState().user?.user.accessToken;
      // if (program && location) {
      //   await saveLocationAndProgram(client_code, program, location, currentUser);
      // }
      const response = await updateProgramCompletion(
        client_code,
        Program_Completion,
        Returned_to_Care,
        Remained_Out_of_Care,
        program_significantly_modified,
        program,
        location,
        start_date,
        end_date,
        referral_status,
        confidence,
        roc_confidence,
        currentUser
      );
      if (!response) {
        throw Error("something went wrong while submitting");
      }
      // return (response as unknown) as string;
      const clientState = getState().client;
      const clientList = clientState ? clientState.clientList : {};
      if (Object.keys(clientList).length > 0) {
        let cl:any = clientList[client_code];
        if (!cl) {
          return (response as unknown) as string;
        }
        cl.referral_status = referral_status ? referral_status : null;
         cl.start_date = start_date ? start_date : null;
         cl.end_date = end_date ? end_date : null;
         cl.Program_Completion = Program_Completion ? Program_Completion : Program_Completion === 0 ? 0 : null;
         cl.Remained_Out_of_Care = Remained_Out_of_Care ? Remained_Out_of_Care : Remained_Out_of_Care === 0 ? 0 :null;
         cl.program_significantly_modified = program_significantly_modified ? program_significantly_modified : null; 
         cl.selected_location = location ? location : null
         const updatedCl = {
          ...cl,
          Program_Completion,
          Returned_to_Care,
          Remained_Out_of_Care,
          program_significantly_modified,
          // selected_location: location
                };
        if (!updatedCl["Client Code"]) {
          return (response as unknown) as string;
        }
        const updatedClList = {
          ...clientList,
          [updatedCl["Client Code"]]: updatedCl
        };
        dispatch(update({ clientList: updatedClList }));
      }
      // dispatch(update({ client: clresult }));
      return (response as unknown) as string;
    };
  },

  getLocations(
    client_code: string,
    selected_program: string,
    is_accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {

      const response = await fetchLocations(client_code, selected_program, is_accessToken);
      const locations = response ? response["Suggested Locations"] : [];
      if (locations.length > 0) {
        const cl: Types.Client = {
          ...getState().client!.client,
          SuggestedLocations: [...locations], 
          client_selected_program: selected_program
        };
        dispatch(update({ client: cl }));
         const clientList = getState().client?.clientList;
        if (clientList && clientList[Number(client_code)]) {
          const client = clientList[client_code];
          const cl: Types.Client = {
            ...client,
            SuggestedLocations: [...locations],
            Program_Completion: 0,
            selected_program,
            selected_location: null
          };
          clientList[client_code] = cl;
          dispatch(update({ clientList }));
        }
      }
    };
  },

  getPcr(
    client_code: string,
    selected_program: string
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const currentUser = getState().user?.user.accessToken;
      const response = await fetchPcr(client_code, selected_program, currentUser);
      const pcr: number | null = response ? response.pcr : null;
      const roc_confidence: number | null = response ? response.roc_confidence : null;
      if (pcr !== null) {
        const cl: Types.Client = {
          ...getState().client!.client,
          Confidence: pcr,
          confidence: pcr,
          Roc_confidence: roc_confidence,
          roc_confidence: roc_confidence
        };
        dispatch(update({ client: cl }));
        const clientList = getState().client?.clientList;
        if (clientList && clientList[Number(client_code)]) {
          const client = clientList[client_code];
          const cl: Types.Client = {
            ...client,
            Confidence: pcr,
            confidence: pcr,
            Roc_confidence: roc_confidence,
            roc_confidence: roc_confidence,
            Program_Completion: 0,
            selected_program
          };

          clientList[client_code] = cl;
          dispatch(update({ clientList }));
        }
      }
    };
  },

  updateFormValues(
    client_code: string,
    values: any
  ): ThunkAction<void, AppState, null, AnyAction> {
    return (dispatch, getState) => {
      const clientList = getState().client?.clientList;
      if (clientList && clientList[Number(client_code)]) {
        const client = clientList[client_code];
        const cl: Types.Client = {
          ...client,
          Program_Completion: values.Program_Completion,
          Returned_to_Care: values.Returned_to_Care,
          Remained_Out_of_Care: values.Remained_Out_of_Care,
          program_significantly_modified: values.program_significantly_modified
        };
        clientList[client_code] = cl;
        dispatch(update({ clientList }));
      }
    };
  },

  getProgramsForClient(
    client_code: string,
    version: string
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const currentUser = getState().user?.user.accessToken;
      const response = await fetchProgramsForClient(client_code, currentUser);
      const clientList = getState().client?.clientList;
      const sDataList = getState().client?.searchData;
      if (!clientList || !clientList[Number(client_code)]) {
        throw new Error("client not found");
      }
      const client = clientList[client_code];
      const sData = sDataList.filter(a => a.client_code === Number(client_code))
      const latestVersion = version ? version : sData.length - 1
      if (response) {
        const cl: Types.Client = {
          ...client,
          SuggestedPrograms: version ? [ sData[latestVersion].client_selected_program ] : response.program_model_suggested || null, 
          SuggestedLocations: sData[latestVersion].client_selected_locations
            ? [sData[latestVersion].client_selected_locations]
            : [],
          selected_program: sData[latestVersion].client_selected_program,
          selected_location: sData[latestVersion].client_selected_locations,
          Program_Completion: sData[latestVersion].Program_Completion,
          Returned_to_Care: sData[latestVersion].Returned_to_Care,
          Remained_Out_of_Care: sData[latestVersion]["Remained Out of Care"],
          ageAtEpisodeStart: sData[latestVersion].ageAtEpisodeStart,
          // client_selected_facility: sData[0].client_selected_facility,
          // client_selected_level: sData[0].client_selected_level,
          client_selected_locations: sData[latestVersion].client_selected_locations,
          client_selected_program: sData[latestVersion].client_selected_program,
          // condition_program: sData[0].condition_program,
          confidence: sData[latestVersion].confidence,
          // facility_type: sData[0].facility_type,
          // level_of_care: sData[0].level_of_care,
          // model_pred: sData[0].model_pred,
          model_program: sData[latestVersion].model_program,
          // program: sData[0].program,
          program_significantly_modified: sData[latestVersion].program_significantly_modified,
          referred_program: sData[latestVersion].referred_program,
          roc_confidence: sData[latestVersion].roc_confidence
        };
        clientList[client_code] = cl;
        dispatch(update({ clientList }));
      }
    };
  },

  saveLocationAndProgram(
    selected_location: string,
    pcr_score: any,
    roc_score: any, 
    selected_program?: string,
    
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const client = getState().client!.client;
      const currentUser = getState().user?.user.accessToken;
      const cl: Types.Client = {
        ...client,
        client_selected_locations: selected_location
      };
      dispatch(update({ client: cl }));
      let programParam: string;
      if (!selected_program && client.client_selected_program && client.client_selected_program[0]) {
        programParam = Array.isArray(client.client_selected_program) ? client.client_selected_program[0] : client.client_selected_program;
      } else if (selected_program) {
        programParam = selected_program;
      } else {
        throw Error("something went wrong while submitting");
      }
      const response = await saveLocationAndProgram(
        client["Client Code"]!,
        programParam,
        selected_location,
        pcr_score,
        roc_score,
        currentUser

      );
      if (!response) {
        throw Error("something went wrong while submitting");
      }
      const clresult: Types.Client = {
        ...cl,
        result_final: response.result
      };
      dispatch(update({ client: clresult }));
      // return clresult;
    };
  },

  submitPrediction(
    client: Types.Client
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      if (!client.client_code) {
        throw new Error("client code required");
      }
      dispatch(update({ client }));
      try {
        const response = await insertPrediction(client);
      } catch (error) {
        throw error;
      }
      // return client;
    };
  },

  searchDClient(
    client_code: string,
    client_name: string,
    is_accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      const response = await searchDClient(client_code, client_name, is_accessToken);
      let arr = response.response;
      let clientList: { [key: string]: any } = {};
      arr && arr.map((c: any) => {
        if (c.client_code) {
          return (clientList[c.client_code] = c);
        }
        return null;
      });
      dispatch(update({ clientList, searchData: response.response }));
      let locations = arr ? arr[0]["Suggested Locations"]? arr[0]["Suggested Locations"] :[] : [];
      if (locations.length > 0) {
        const cl: Types.Client = {
          ...getState().client!.client,
          SuggestedLocations: [...locations],
         
        };
        dispatch(update({ client: cl }));
        const clientList = getState().client?.clientList;
        if (clientList && clientList[Number(client_code)]) {
          const client = clientList[client_code];
          const cl: Types.Client = {
            ...client,
            SuggestedLocations: [...locations],
            
          };
         clientList[client_code] = cl;
          dispatch(update({ clientList}));
        }
      }
      
      return;
        };
      
    
  },


  insertDClient(
    Dclient: Types.DynamicClient,
    is_accessToken: any
  ): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async (dispatch, getState) => {
      let locations: string[] = [];
      let updatedDClient: Types.DynamicClient;
      const is_prediction_available = getState().user?.user.is_prediction_available
      try {
        return await insertDClient(Dclient, is_accessToken)
          .then(async response => {
            const cl = {
              ...Dclient,
              program_type: response.data.response.program_type && response.data.response.program_type || null,
              Confidence: response.data.response.confidence && response.data.response.confidence|| null,
              Roc_confidence: response.data.response.roc_confidence && response.data.response.roc_confidence|| null,
              referred_program: response.data.response.program_type && response.data.response.program_type || null,
              model_program:  response.data.response.model_program && response.data.response.model_program || null,
              SuggestedPrograms: response.data.response.list_program_types && response.data.response.list_program_types || null 
            };
             
            dispatch(update({ client: cl }));
           if(is_prediction_available){ 
              if(response.data.status !== "failed"){
                if(Dclient["Exclusionary Criteria Exists/Referral Rejected"] !== "0"){
                  let data = [] as any;
                updatedDClient = cl; 
                const res = await fetchLocations(
                  Object.keys(updatedDClient).includes("New Client Code") ? updatedDClient["New Client Code"] :  updatedDClient["Client Code"],
                  updatedDClient.program_type,
                  is_accessToken
                );
                if (res && res["result"] && res["result"] !== "") {
                   throw new Error(res["result"]);
                }
                if (res && res["Suggested Locations"]) {
                  locations = res["Suggested Locations"];
                }
                if (locations.length > 0) {
                  const cl: Types.DynamicClient = {
                    ...updatedDClient,
                    SuggestedLocations: [...locations],
                    client_selected_program: updatedDClient.program_type[0]
                  }
                  dispatch(update({ client: cl }));
                }
              }
              }
              
              }
              
            
            // return cl;
            return response;
            

          })

      }
      catch (errors) {
        // const client :any ={ response: "failed"}
        dispatch(update({ errors: errors }));
        throw errors;
        console.log(errors)
        return errors;
      }

    }
  },
  clear(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(
        update({
          client: Types.emptyDClient,
          // page1FormCompleted: false,
          // excludePage2: false
        })
      );
    };
  },

  clearErrors(): ThunkAction<Promise<void>, AppState, null, AnyAction> {
    return async dispatch => {
      dispatch(update({ errors: {} }));
    };
  }
};


