import * as Types from "../../api/definitions"; // CRA does not support abs paths for typescript yet.
import { FormikErrors } from "formik";
export interface ClientState {
  client: Types.Client;
  
  clientList: {
    [key: string]: Types.Client;
  };
  errors: FormikErrors<Types.Client>;
  excludePage2: boolean;
  page1FormCompleted: boolean;
  page2FormCompleted: boolean;
  searchData: any; 
}

export interface ConfigurationState {
  configuration: Types.Configuration;
}
export interface UsersState {
  usersList: Types.Users[];
  availableUsersList: Types.Users[];
  rolesList: Types.Users[];
}

export const emptyUsers: Types.Users = {
  id: "",
  first_name: ""
};   

export interface ReferralState {
  referralList: Types.Referral[];
  availableReferralList: Types.Referral[];
}

export interface AnalyticsState {
  analyticsList: Types.Analytics[];
  PCRAnalyticsList: Types.Analytics[];
  ROCAnalyticsList: Types.Analytics[];
  ReplacementList: Types.Analytics[];
  StayList: Types.Analytics[];
  OccupancyList: Types.Analytics[];
  AllocationList: Types.Analytics[];
  Program_Alloc_List: Types.Analytics[]; 
  Market_Analytics_List: Types.Analytics[];
  Performance_Analytics_List: Types.Analytics[];
  Gender_List: Types.Analytics[];
  Age_List : Types.Analytics[];
  Tool_List: Types.Analytics[];
  Demo_List: Types.Analytics[];
  Calibration_List: Types.Analytics[];
}

export interface QuestionsState {
  configuredQuestionsList: Types.DynamicClient[];
  client: Types.DynamicClient;
  errors: any;
  clientList: any;
  searchData: any;
}

export const emptyReferral: Types.Referral = {
  referral: "",
  referral_name: ""
};

export interface ProgramState {
  programList: Types.Program[];
  availableProgramList: Types.Program[];
}

export const emptyProgram: Types.Program = {
  program: "",
  program_name: ""
};

export interface LocationState {
  locationList: Types.Location[];
}

export const emptyLocation: Types.Location = {
  location: "",
  location_name: ""
};
