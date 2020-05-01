import * as Yup from "yup";
import { searchClient } from "../api/api";

let clientCodeResponse: { [key: number]: boolean } = {};

export const Step1ValidationSchema = Yup.object().shape({
  episode_start: Yup.string()
    .required("Required")
    .nullable(),
  episode_number: Yup.string()
    .required("Required")
    .nullable(),
  CYF_code: Yup.string()
    .required("Required")
    .nullable(),
  primaryRaceCode: Yup.string()
    // .required("Required")
    .nullable(),
  client_code: Yup.number()
    .required("Required")
    .positive()
    .integer()
    .typeError("Invalid. Enter numeric code.")
    .test("is-duplicate", "client code already exists", async value => {
      if (!value) {
        return false;
      }
      if (value in clientCodeResponse) {
        return clientCodeResponse[value];
      }
      const response = await searchClient(value);
      if (response && response.length > 0) {
        clientCodeResponse[value] = false;
        return false;
      }
      clientCodeResponse[value] = true;
      return true;
    })
    .nullable(),
  name: Yup.string()
    .required("Required")
    .nullable(),
  last_name: Yup.string()
    .required("Required")
    .nullable(),
  dob: Yup.string()
    .required("Required")
    .nullable(),
  age: Yup.string()
    .required("Required")
    .nullable(),
  gender: Yup.string()
    .required("Required")
    .nullable(),
  primary_language: Yup.string()
    .required("Required")
    .nullable(),
  ls_type: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_placements: Yup.string()
    .required("Required")
    .nullable(),
  number_of_foster_care_placements: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_AWOLS: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_treatment_terminations: Yup.string()
    .required("Required")
    .nullable(),
  termination_directly_to_AV: Yup.string()
    .required("Required")
    .nullable(),
  length_of_time_since_living_at_home: Yup.string()
    .required("Required")
    .nullable(),
  hist_of_prior_program_SAO: Yup.string()
    .required("Required")
    .nullable(),
  autism_Diagnosis: Yup.string()
    .required("Required")
    .nullable(),
  borderline_Personality: Yup.string()
    .required("Required")
    .nullable(),
  reactive_Attachment_Disorder: Yup.string()
    .required("Required")
    .nullable(),
  animal_cruelty: Yup.string()
    .required("Required")
    .nullable(),
  schizophrenia: Yup.string()
    .required("Required")
    .nullable(),
  psychosis: Yup.string()
    .required("Required")
    .nullable(),
  borderline_IQ: Yup.string()
    .required("Required")
    .nullable(),
  significant_mental_health_symptoms: Yup.number()
    .required("Required")
    .min(0)
    .integer()
    .nullable(),
  prior_hospitalizations: Yup.number()
    .required("Required")
    .min(0)
    .integer()
    .nullable(),
  severe_mental_health_symptoms: Yup.string()
    .required("Required")
    .nullable(),
  compliant_with_meds: Yup.string()
    .required("Required")
    .nullable(),
  Exclusionary_Criteria: Yup.boolean(),

  incarcerated_caregivers: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),
  death_Caregiver: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  incarcerated_siblings: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  death_Silblings: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  alcohol_Use: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  drug_Use: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  abuse_neglect: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable()
});

export const EditStep1ValidationSchema = Yup.object().shape({
  episode_start: Yup.string()
    .required("Required")
    .nullable(),
  episode_number: Yup.string()
    .required("Required")
    .nullable(),
  CYF_code: Yup.string()
    .required("Required")
    .nullable(),
  primaryRaceCode: Yup.string()
    // .required("Required")
    .nullable(),
    name: Yup.string()
    .required("Required")
    .nullable(),
  last_name: Yup.string()
    .required("Required")
    .nullable(),
  dob: Yup.string()
    .required("Required")
    .nullable(),
  age: Yup.string()
    .required("Required")
    .nullable(), 
  gender: Yup.string()
    .required("Required")
    .nullable(),
  primary_language: Yup.string()
    .required("Required")
    .nullable(),
  ls_type: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_placements: Yup.string()
    .required("Required")
    .nullable(),
  number_of_foster_care_placements: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_AWOLS: Yup.string()
    .required("Required")
    .nullable(),
  number_of_prior_treatment_terminations: Yup.string()
    .required("Required")
    .nullable(),
  termination_directly_to_AV: Yup.string()
    .required("Required")
    .nullable(),
  length_of_time_since_living_at_home: Yup.string()
    .required("Required")
    .nullable(),
  hist_of_prior_program_SAO: Yup.string()
    .required("Required")
    .nullable(),
  autism_Diagnosis: Yup.string()
    .required("Required")
    .nullable(),
  borderline_Personality: Yup.string()
    .required("Required")
    .nullable(),
  reactive_Attachment_Disorder: Yup.string()
    .required("Required")
    .nullable(),
  animal_cruelty: Yup.string()
    .required("Required")
    .nullable(),
  schizophrenia: Yup.string()
    .required("Required")
    .nullable(),
  psychosis: Yup.string()
    .required("Required")
    .nullable(),
  borderline_IQ: Yup.string()
    .required("Required")
    .nullable(),
  significant_mental_health_symptoms: Yup.number()
    .required("Required")
    .min(0)
    .integer()
    .nullable(),
  prior_hospitalizations: Yup.number()
    .required("Required")
    .min(0)
    .integer()
    .nullable(),
  severe_mental_health_symptoms: Yup.string()
    .required("Required")
    .nullable(),
  compliant_with_meds: Yup.string()
    .required("Required")
    .nullable(),
  Exclusionary_Criteria: Yup.boolean(),

  incarcerated_caregivers: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),
  death_Caregiver: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  incarcerated_siblings: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  death_Silblings: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  alcohol_Use: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  drug_Use: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable(),

  abuse_neglect: Yup.string()
    .when("Exclusionary_Criteria", {
      is: false,
      then: Yup.string().required("Required"),
      otherwise: Yup.string()
    })
    .nullable()
});

// unused - all fields on step2 are optional. 
export const Step2ValidationSchema = Yup.object().shape({
  yls_PriorCurrentOffenses_Score: Yup.number().max(5, "Score range should be between 0-5")
  .nullable(),
   yls_FamCircumstances_Score: Yup.number().max(6, "Score range should be between 0-6")
  .nullable(),
   yls_Edu_Employ_Score: Yup.number().max(7, "Score range should be between 0-7")
      .nullable(),
  yls_Peer_Score: Yup.number().max(4, "Score range should be between 0-4")
    .nullable(),
  yls_Subab_Score: Yup.number().max(5, "Score range should be between 0-5")
    .nullable(),
  yls_Leisure_Score: Yup.number().max(3, "Score range should be between 0-3")
    .nullable(),
  yls_Personality_Score: Yup.number().max(7, "Score range should be between 0-7")
    .nullable(),
  yls_Attitude_Score: Yup.number().max(5, "Score range should be between 0-5")
    .nullable(),
   family_support: Yup.number().max(2, "Score range should be between 0-2")
    .nullable(),
  fire_setting: Yup.number().max(3, "Score range should be between 0-3")
    .nullable(),
  level_of_aggression: Yup.number().max(9, "Score range should be between 0-9")
    .nullable(),
  client_self_harm: Yup.number().max(3, "Score range should be between 0-3")
    .nullable(),
  Screening_tool_Trauma: Yup.number().max(40, "Score range should be between 0-40")
    .nullable(),
  cans_LifeFunctioning: Yup.number().max(39, "Score range should be between 0-39")
    .nullable(),
  cans_YouthStrengths: Yup.number().max(33, "Score range should be between 0-33")
    .nullable(),
  cans_CareGiverStrengths: Yup.number().max(54, "Score range should be between 0-54")
    .nullable(),
  cans_Culture: Yup.number().max(12, "Score range should be between 0-12")
    .nullable(),
  cans_YouthBehavior: Yup.number().max(30, "Score range should be between 0-30")
    .nullable(),
  cans_YouthRisk: Yup.number().max(36, "Score range should be between 0-36")
    .nullable(),
  cans_Trauma_Exp: Yup.number().max(36, "Score range should be between 0-36")
    .nullable(),
  // referred_program: Yup.string()
  //   .required("Required")
  //   .nullable()
});

export const ConfigurationSchema = Yup.object().shape({
  gender: Yup.string()
    .required("Required")
    .nullable(),
  program: Yup.string()
    .required("Required")
    .nullable(),
  level_of_care: Yup.string()
    .required("Required")
    .nullable(),
  facility_type: Yup.string()
    .required("Required")
    .nullable(),
  program_model_suggested: Yup.string()
    .required("Required")
    .nullable()
  // program_type: Yup.string()
  //   .required("Required")
  //   .nullable()
});
