/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Formik, FormikProps, FormikErrors, FieldProps, Field } from "formik";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Step1ValidationSchema, EditStep1ValidationSchema } from "./ValidationSchema";
import SnackNotification from "./SnackNotification";

import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label,
  fieldBox,
  fieldBox1,
  selectField,
  datePicker
} from "./styles";
import * as Types from "../api/definitions";
import ErrorMessage from "./ErrorMessage";

interface PredictionFormStep1Props {
  Referral: Types.Referral[];
  client: Types.Client;
  onFormSubmit: (client: Types.Client) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  isEdit: string;
  errors: FormikErrors<Types.Client> | undefined;
}

function getAge(date: Date | null, fromDate: Date | null = null) {
  if (!date) {
    return "";
  }
  let today: Date;
  if (!fromDate) {
    today = new Date();
  } else {
    today = new Date(fromDate);
  }

  var birthDate = date;
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const EpisodeStartPicker: React.FC<FormikProps<Types.Client> &
  FieldProps> = props => {
  const { field, form, ...other } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        clearable
        disableFuture
        autoOk
        fullWidth
        inputVariant="standard"
        name={field.name}
        value={field.value}
        css={inputField}
        onChange={date => {
          form.setFieldValue(field.name, date, false);
        }}
        placeholder="mm/dd/yyyy"
        views={["year", "month", "date"]}
        openTo="year"
        format="MM/dd/yyyy"
        {...other}
      />
    </MuiPickersUtilsProvider>
  );
};

const DobPicker: React.FC<FormikProps<Types.Client> & FieldProps> = props => {
  const { field, form, ...other } = props;
  
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        clearable
        disableFuture
        autoOk
        fullWidth
        inputVariant="standard"
        name={field.name}
        value={field.value}
        css={inputField}
        onChange={date => {
          form.setFieldValue(field.name, date, false);
          const age = getAge(date) || "";
          form.setFieldValue("age", age, false);
        }}
        placeholder="mm/dd/yyyy"
        views={["year", "month", "date"]}
        openTo="year"
        format="MM/dd/yyyy"
        {...other}
      />
    </MuiPickersUtilsProvider>
  );
};

const PredictionFormStep1: React.FC<PredictionFormStep1Props> = props => {
  const { Referral, isEdit  } = props;
  
    const renderErrorNotification = () => {
    const { errors } = props;
    
    if (!errors) {
      return null;
    }
    return <SnackNotification errors={errors} />;
  };
  

  return (
    <div css={wrap}>
      {renderErrorNotification()}
      <div css={mainContent}>
        <Formik
          initialErrors={props.errors}
          initialValues={props.client} 
          enableReinitialize
          validationSchema={isEdit ? EditStep1ValidationSchema : Step1ValidationSchema}
          onSubmit={(values, helpers) => {
            const dob = values.dob
              ? format(new Date(values.dob), "yyyy-MM-dd")
              : "";
            const ep = values.episode_start
              ? format(new Date(values.episode_start), "yyyy-MM-dd")
              : "";

            values.dob = dob;
            values.episode_start = ep;
            const ageAtEp = getAge(
              new Date(values.dob),
              new Date(values.episode_start)
            );
            values.ageAtEpisodeStart = ageAtEp.toString() || "";
            props.onFormSubmit(values);
            helpers.resetForm();
          }}
        >
          {({ values, handleSubmit, handleChange, errors }) => (
            <form name="newClientForm" onSubmit={handleSubmit}>
              <h1 css={subHeading}>Demographics</h1>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Date of Referral</label>
                  <Field
                    css={datePicker}
                    name="episode_start"
                    component={EpisodeStartPicker}
                  />
                  <ErrorMessage name="episode_start" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Previously Referred</label>
                  <select
                    css={selectField}
                    name="episode_number"
                    value={values.episode_number || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">No - Episode 1</option>
                    <option value="2">Yes - Episode 2</option>
                    <option value="3">Yes - Episode 3</option>
                    <option value="4">Yes - Episode 4</option>
                    <option value="5">Yes - Episode 5</option>
                    <option value="6">Yes - More than 5 episodes</option>
                  </select>
                  <ErrorMessage component="span" name="episode_number" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Client Code/ID</label>
                  <input
                    css={inputField}
                    name="client_code"
                    type="text"
                    placeholder=""
                    value={values.client_code || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="client_code" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>First Name</label>
                  <input
                    css={inputField}
                    name="name"
                    type="text"
                    placeholder=""
                    value={values.name || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="name" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Last Name</label>
                  <input
                    css={inputField}
                    name="last_name"
                    type="text"
                    placeholder=""
                    value={values.last_name || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="last_name" />
                </div>
              </div>
              <div css={fieldRow} style={{ flex: "2 1 auto" }}>
                <div css={twoCol}>
                  <label css={label}>Date of Birth</label>
                  <Field css={datePicker} name="dob" component={DobPicker} />
                </div>
                <div css={twoCol}>
                  <label css={label}>Age</label>
                  <input
                    css={inputField}
                    name="age"
                    type="text"
                    readOnly
                    placeholder=""
                    value={values.age || ""}
                  />
                  <ErrorMessage component="span" name="age" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Sex</label>
                  <div
                    css={fieldBox}
                    style={{ width: "47.8%", display: "inline-block" }}
                  >
                  
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="gender"
                      id="female"
                      value="1"
                      checked={values.gender === "1" || values.gender === 1 } 
                    />{" "}
                    <label htmlFor="female">Female</label>
                  </div>
                  <div
                    css={fieldBox}
                    style={{ width: "47.8%", display: "inline-block" }}
                  >
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="gender"
                      id="male"
                      value="2"
                      checked={values.gender === "2" || values.gender === 2}
                    />{" "}
                    <label htmlFor="male">Male</label>
                  </div>
                  <ErrorMessage component="span" name="gender" />
                </div>
              </div>
              <div css={fieldRow}></div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Primary Language</label>
                  <select
                    css={selectField}
                    name="primary_language"
                    id="primary_language"
                    value={values.primary_language || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">English</option>
                    <option value="2">Not English</option>
                  </select>
                  <ErrorMessage component="span" name="primary_language" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Referral Source</label>
                  
                  <select
                    css={selectField}
                    name="RefSourceCode"
                    id="referrel_source"
                    value={values.RefSourceCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Referral.map(p => (
                      <option key={p.referral_code} value={p.referral_code}>
                        {p.referral_name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage component="span" name="RefSourceCode" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Legal Status</label>
                  <select
                    css={selectField}
                    name="ls_type"
                    id="legal_status"
                    value={values.ls_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">Voluntary</option>
                    <option value="2">Dependant</option>
                    {/* <option value="3">Voluntary Delinquent</option>
                    <option value="4">Dependant Delinquent</option> */}
                    <option value="5">Delinquent</option>
                  </select>
                  <ErrorMessage component="span" name="ls_type" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Secondary Involvement (Crossover Youth)</label>
                  <select
                    css={selectField}
                    name="CYF_code"
                    value={values.CYF_code || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">CYF</option>
                    <option value="2">Juvenile Justice</option>
                  </select>
                  <ErrorMessage component="span" name="CYF_code" />
                </div>
              </div>
              {/* <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Primary Race Code</label>
                  <select
                    css={selectField}
                    name="primaryRaceCode"
                    id="primaryRaceCode"
                    value={values.primaryRaceCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">Caucasian</option>
                    <option value="2">African American</option>
                    <option value="3">Hispanic</option>
                    <option value="4">Other</option>
                  </select>
                  <ErrorMessage component="span" name="primaryRaceCode" />
                </div>
              </div> */}
              <h1 css={subHeading}>Placement History</h1>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Number of prior placements</label>
                  <select
                    css={selectField}
                    name="number_of_prior_placements"
                    id="number_of_prior_placements"
                    value={values.number_of_prior_placements || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Many</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="number_of_prior_placements"
                  />
                </div>
                <div css={twoCol}>
                  <label css={label}>Number of prior foster homes</label>
                  <select
                    css={selectField}
                    name="number_of_foster_care_placements"
                    id="number_of_foster_care_placements"
                    value={values.number_of_foster_care_placements || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Many</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="number_of_foster_care_placements"
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>History of AWOLS</label>
                  <select
                    css={selectField}
                    name="number_of_prior_AWOLS"
                    id="number_of_prior_AWOLS"
                    value={values.number_of_prior_AWOLS || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Many</option>
                  </select>
                  <ErrorMessage component="span" name="number_of_prior_AWOLS" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Total Prior Placement Terminations</label>
                  <select
                    css={selectField}
                    name="number_of_prior_treatment_terminations"
                    id="number_of_prior_treatment_terminations"
                    value={values.number_of_prior_treatment_terminations || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Many</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="number_of_prior_treatment_terminations"
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>
                    Terminations directly before referred
                  </label>
                  <select
                    css={selectField}
                    name="termination_directly_to_AV"
                    id="termination_directly_to_AV"
                    value={values.termination_directly_to_AV || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">None</option>
                    <option value="1">Unknown</option>
                    <option value="2">One</option>
                    <option value="3">Two or more</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="termination_directly_to_AV"
                  />
                </div>
                <div css={twoCol}>
                  <label css={label}>Time since living at home</label>
                  <select
                    css={selectField}
                    name="length_of_time_since_living_at_home"
                    id="length_of_time_since_living_at_home"
                    value={values.length_of_time_since_living_at_home || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">0-6 months</option>
                    <option value="1">6-12 months</option>
                    <option value="2">12+ months</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="length_of_time_since_living_at_home"
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}> Sexually Acting Out behaviors in Placement</label>
                  </div>
				  <div css={twoCol}>
          <div css={fieldBox1}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="hist_of_prior_program_SAO"
                      id="hist_of_prior_program_SAO-yes"
                      value="1"
                      checked={values.hist_of_prior_program_SAO === "1" || values.hist_of_prior_program_SAO === 1}
                    />{" "}
                    <label htmlFor="hist_of_prior_program_SAO-yes">Yes</label>
                  </div>
                  <div css={fieldBox1}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="hist_of_prior_program_SAO"
                      id="hist_of_prior_program_SAO-no"
                      value="0"
                      checked={values.hist_of_prior_program_SAO === "0" || values.hist_of_prior_program_SAO === 0}
                    />{" "}
                    <label htmlFor="hist_of_prior_program_SAO-no">No</label>
                  </div>
                  
                  <ErrorMessage component="span" name="hist_of_prior_program_SAO" />
                </div>
                </div>
                
              
              <h1 css={subHeading}>Mental Health</h1>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Autism Diagnosis</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="autism_Diagnosis"
                      id="autism_Diagnosis-yes"
                      value="1"
                      checked={values.autism_Diagnosis === "1" || values.autism_Diagnosis === 1}
                    />{" "}
                    <label htmlFor="autism_Diagnosis-yes">Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="autism_Diagnosis"
                      id="autism_Diagnosis-no"
                      value="0"
                      checked={values.autism_Diagnosis === "0" || values.autism_Diagnosis === 0}
                    />{" "}
                    <label htmlFor="autism_Diagnosis-no">No</label>
                  </div>
                  <ErrorMessage component="span" name="autism_Diagnosis" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Borderline Personality Disorder</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="borderline_Personality"
                      id="borderline_Personality-yes"
                      value="1"
                      checked={values.borderline_Personality === "1" || values.borderline_Personality === 1}
                    />{" "}
                    <label htmlFor="borderline_Personality-yes">Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="borderline_Personality"
                      id="borderline_Personality-no"
                      value="0"
                      checked={values.borderline_Personality === "0" || values.borderline_Personality === 0}
                    />{" "}
                    <label htmlFor="borderline_Personality-no">No</label>
                  </div>
                  <ErrorMessage
                    component="span"
                    name="borderline_Personality"
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Reactive Attachment Disorder</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="reactive_Attachment_Disorder"
                      id="reactive_Attachment_Disorder-yes"
                      value="1"
                      checked={values.reactive_Attachment_Disorder === "1" || values.reactive_Attachment_Disorder === 1}
                    />{" "}
                    <label htmlFor="reactive_Attachment_Disorder-yes">
                      Yes
                    </label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="reactive_Attachment_Disorder"
                      id="reactive_Attachment_Disorder-no"
                      value="0"
                      checked={values.reactive_Attachment_Disorder === "0" || values.reactive_Attachment_Disorder === 0}
                    />{" "}
                    <label htmlFor="reactive_Attachment_Disorder-no">No</label>
                  </div>
                  <ErrorMessage
                    component="span"
                    name="reactive_Attachment_Disorder"
                  />
                </div>
                <div css={twoCol}>
                  <label css={label}>Animal Cruelty</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="animal_cruelty"
                      id="animal_cruelty-yes"
                      value="1"
                      checked={values.animal_cruelty === "1" || values.animal_cruelty === 1}
                    />{" "}
                    <label htmlFor="animal_cruelty-yes">Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="animal_cruelty"
                      id="animal_cruelty-no"
                      value="0"
                      checked={values.animal_cruelty === "0" || values.animal_cruelty === 0}
                    />{" "}
                    <label htmlFor="animal_cruelty-no">No</label>
                  </div>
                  <ErrorMessage component="span" name="animal_cruelty" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Schizophrenia</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="schizophrenia"
                      id="schizophrenia-yes"
                      value="1"
                      checked={values.schizophrenia === "1" || values.schizophrenia === 1}
                    />{" "}
                    <label htmlFor="schizophrenia-yes">Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="schizophrenia"
                      id="schizophrenia-no"
                      value="0"
                      checked={values.schizophrenia === "0" || values.schizophrenia === 0}
                    />{" "}
                    <label htmlFor="schizophrenia-no">No</label>
                  </div>
                  <ErrorMessage component="span" name="schizophrenia" />
                </div>
                <div css={twoCol}>
                  <label css={label}>Psychosis</label>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="psychosis"
                      id="psychosis-yes"
                      value="1"
                      checked={values.psychosis === "1" || values.psychosis === 1}
                    />{" "}
                    <label htmlFor="psychosis-yes">Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="psychosis"
                      id="psychosis-no"
                      value="0"
                      checked={values.psychosis === "0" || values.psychosis === 0}
                    />{" "}
                    <label htmlFor="psychosis-no">No</label>
                  </div>
                  <ErrorMessage component="span" name="psychosis" />
                </div>
              </div>

              <div css={fieldRow} style={{ justifyContent: "flex-start" }}>
                <div css={twoCol}>
                  <label css={label}>IQ</label>

                  <select
                    css={selectField}
                    style={{ width: "49%" }}
                    name="borderline_IQ"
                    id="borderline_IQ"
                    value={values.borderline_IQ || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">70+</option>
                    <option value="1">&lt;70</option>
                  </select>
                  <ErrorMessage component="span" name="borderline_IQ" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Significant Mental Health Symptoms Score</label>
                  <input
                    css={inputField}
                    name="significant_mental_health_symptoms"
                    type="text"
                    placeholder=""
                    value={values.significant_mental_health_symptoms || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component="span"
                    name="significant_mental_health_symptoms"
                  />
                </div>
                <div css={twoCol}>
                  <label css={label}>Number of Prior Mental Health Hospitalizations</label>
                  <input
                    css={inputField}
                    name="prior_hospitalizations"
                    type="text"
                    placeholder=""
                    value={values.prior_hospitalizations || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component="span"
                    name="prior_hospitalizations"
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Time since last hospitalization</label>
                  <select
                    css={selectField}
                    name="severe_mental_health_symptoms"
                    id="severe_mental_health_symptoms"
                    value={values.severe_mental_health_symptoms || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">No ER/hospitalizations</option>
                    <option value="1">Last 3 months</option>
                    <option value="2">6 months ago</option>
                    <option value="3">9 months ago</option>
                    <option value="4">1 year or more ago</option>
                  </select>
                  <ErrorMessage
                    component="span"
                    name="severe_mental_health_symptoms"
                  />
                </div>
                <div css={twoCol}>
                  <label css={label}>Medication Compliant</label>
                  <select
                    css={selectField}
                    name="compliant_with_meds"
                    id="compliant_with_meds"
                    value={values.compliant_with_meds || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                    <option value="9">N/A</option>
                  </select>
                  <ErrorMessage component="span" name="compliant_with_meds" />
                </div>
              </div>
              <div css={fieldRow} style={{ justifyContent: "flex-start" }}>
                <input
                  name="Exclusionary_Criteria"
                  id="Exclusionary_Criteria"
                  type="checkbox"
                  onChange={handleChange}
                  checked={values.Exclusionary_Criteria === true}
                  value="true"
                />
                <label css={label} htmlFor="Exclusionary_Criteria">
                  Exclusionary Criteria Exists/Referral Rejected
                </label>
              </div>
              {!values.Exclusionary_Criteria && (
                <div>
                  <h1 css={subHeading}>Social/Family History</h1>
                  <div css={fieldRow}>
                    <div css={twoCol}>
                      <label css={label}>Incarcerated Caregiver</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="incarcerated_caregivers"
                          value="1"
                          checked={values.incarcerated_caregivers === "1" || values.incarcerated_caregivers === 1}
                        />{" "}
                        <label htmlFor="incarcerated_caregivers-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="incarcerated_caregivers"
                          id="incarcerated_caregivers-no"
                          value="0"
                          checked={values.incarcerated_caregivers === "0" || values.incarcerated_caregivers === 0}
                        />{" "}
                        <label htmlFor="incarcerated_caregivers-no">No</label>
                      </div>
                      <ErrorMessage
                        component="span"
                        name="incarcerated_caregivers"
                      />
                    </div>
                    <div css={twoCol}>
                      <label css={label}>Deceased Caregiver</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="death_Caregiver"
                          id="death_Caregiver-yes"
                          value="1"
                          checked={values.death_Caregiver === "1" || values.death_Caregiver === 1}
                        />{" "}
                        <label htmlFor="death_Caregiver-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="death_Caregiver"
                          id="death_Caregiver-no"
                          value="0"
                          checked={values.death_Caregiver === "0" || values.death_Caregiver === 0}
                        />{" "}
                        <label htmlFor="death_Caregiver-no">No</label>
                      </div>
                      <ErrorMessage component="span" name="death_Caregiver" />
                    </div>
                  </div>
                  <div css={fieldRow}>
                    <div css={twoCol}>
                      <label css={label}>Incarcerated Siblings</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="incarcerated_siblings"
                          id="incarcerated_siblings-yes"
                          value="1"
                          checked={values.incarcerated_siblings === "1" || values.incarcerated_siblings === 1}
                        />{" "}
                        <label htmlFor="incarcerated_siblings-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="incarcerated_siblings"
                          id="incarcerated_siblings-no"
                          value="0"
                          checked={values.incarcerated_siblings === "0" || values.incarcerated_siblings === 0}
                        />{" "}
                        <label htmlFor="incarcerated_siblings-no">No</label>
                      </div>
                      <ErrorMessage
                        component="span"
                        name="incarcerated_siblings"
                      />
                    </div>
                    <div css={twoCol}>
                      <label css={label}>Deceased Siblings</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="death_Silblings"
                          id="death_Silblings-yes"
                          value="1"
                          checked={values.death_Silblings === "1" || values.death_Silblings === 1}
                        />{" "}
                        <label htmlFor="death_Silblings-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="death_Silblings"
                          id="death_Silblings-no"
                          value="0"
                          checked={values.death_Silblings === "0" || values.death_Silblings === 0}
                        />{" "}
                        <label htmlFor="death_Silblings-no">No</label>
                      </div>
                      <ErrorMessage component="span" name="death_Silblings" />
                    </div>
                  </div>
                  <div css={fieldRow}>
                    <div css={twoCol}>
                      <label css={label}>Alcohol Use</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="alcohol_Use"
                          id="alcohol_Use-yes"
                          value="1"
                          checked={values.alcohol_Use === "1" || values.alcohol_Use === 1}
                        />{" "}
                        <label htmlFor="alcohol_Use-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="alcohol_Use"
                          id="alcohol_Use-no"
                          value="0"
                          checked={values.alcohol_Use === "0" || values.alcohol_Use === 0}
                        />{" "}
                        <label htmlFor="alcohol_Use-no">No</label>
                      </div>
                      <ErrorMessage component="span" name="alcohol_Use" />
                    </div>
                    <div css={twoCol}>
                      <label css={label}>Drug Use</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="drug_Use"
                          id="drug_Use-yes"
                          value="1"
                          checked={values.drug_Use === "1" || values.drug_Use === 1}
                        />{" "}
                        <label htmlFor="drug_Use-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="drug_Use"
                          id="drug_Use-no"
                          value="0"
                          checked={values.drug_Use === "0" || values.drug_Use === 0}
                        />{" "}
                        <label htmlFor="drug_Use-no">No</label>
                      </div>
                      <ErrorMessage component="span" name="drug_Use" />
                    </div>
                  </div>
                  <div css={fieldRow}>
                    <div css={twoCol}>
                      <label css={label}>Abuse/Neglect</label>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="abuse_neglect"
                          id="abuse_neglect-yes"
                          value="1"
                          checked={values.abuse_neglect === "1" || values.abuse_neglect === 1}
                        />{" "}
                        <label htmlFor="abuse_neglect-yes">Yes</label>
                      </div>
                      <div css={fieldBox}>
                        <input
                          type="radio"
                          onChange={handleChange}
                          name="abuse_neglect"
                          id="abuse_neglect-no"
                          value="0"
                          checked={values.abuse_neglect === "0" || values.abuse_neglect === 0} 
                        />{" "}
                        <label htmlFor="abuse_neglect-no">No</label>
                      </div>
                      <ErrorMessage component="span" name="abuse_neglect" />
                    </div>
                  </div>
                </div>
              )}
              <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  style={{ marginRight: 10 }}
                >
                  {values.Exclusionary_Criteria ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      {/* MAIN CONTENT */}
    </div>
  );
};

export default PredictionFormStep1;
