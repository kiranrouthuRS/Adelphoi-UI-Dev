/* tslint:disable */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import SnackNotification from "./SnackNotification";
import { Step2ValidationSchema } from "./ValidationSchema";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { domainPath } from "../App"
import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label,
  backdrop
} from "./styles";
import * as Types from "../api/definitions";

interface PredictionFormStep2Props {
  client: Types.Client;
  onFormSubmit: (client: Types.Client) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  errors: FormikErrors<Types.Client> | undefined;
}

const PredictionFormStep2: React.FC<PredictionFormStep2Props> = props => {
  const history = useHistory();
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
        <Backdrop css={backdrop} open={props.isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Formik
          initialValues={props.client}
          initialErrors={props.errors}
          validationSchema={Step2ValidationSchema}
          enableReinitialize
          onSubmit={async (values, helpers) => {
            await props.onFormSubmit(values);
            //helpers.resetForm();
          }}
        >
          {({ values, handleSubmit, handleChange,errors}) => (
            <form name="newClientForm2" onSubmit={handleSubmit}>
              <h1 css={subHeading}>Assessment Scores</h1>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Prior/Current Offenses Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-5</label>
                  </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_PriorCurrentOffenses_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_PriorCurrentOffenses_Score || ""}
                    onChange={handleChange}
                    
                  />
                  
                  <span style={{color: "red"}}>{errors.yls_PriorCurrentOffenses_Score}</span>
                  {/* <ErrorMessage
                    component="span"
                    name="yls_PriorCurrentOffenses_Score"
                  /> */}
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Family Circumstances Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-6</label>
                </div>
                <div css={twoCol}>
                <input
                    type="text"
                    name="yls_FamCircumstances_Score" 
                    css={inputField}
                    placeholder=""
                    value={values.yls_FamCircumstances_Score || ""}
                    onChange={handleChange}
                    
                  />
                   <span style={{color: "red"}}>{errors.yls_FamCircumstances_Score}</span>
                   </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Education/Employment Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-7</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Edu_Employ_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_Edu_Employ_Score || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.yls_Edu_Employ_Score}</span>
                  {/* <ErrorMessage component="span" name="yls_Edu_Employ_Score" /> */}
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Peer Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-4</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Peer_Score"
                    css={inputField} 
                    placeholder=""
                    value={values.yls_Peer_Score || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.yls_Peer_Score}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Substance Abuse Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-5</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Subab_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_Subab_Score || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.yls_Subab_Score}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Leisure Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-3</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Leisure_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_Leisure_Score || ""}
                    onChange={handleChange}
                  />
                  <span style={{color: "red"}}>{errors.yls_Leisure_Score}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Personality Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-7</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Personality_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_Personality_Score || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.yls_Personality_Score}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>YLS Attitude Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-5</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="yls_Attitude_Score"
                    css={inputField}
                    placeholder=""
                    value={values.yls_Attitude_Score || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.yls_Attitude_Score}</span>
                </div>
              </div>
              
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Family Support</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-2</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="family_support"
                    css={inputField}
                    placeholder=""
                    value={values.family_support || ""}
                    onChange={handleChange}
                  />
                  <span style={{color: "red"}}>{errors.family_support}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Fire Setting</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-3</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="fire_setting"
                    css={inputField}
                    placeholder=""
                    value={values.fire_setting || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.fire_setting}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Level of Aggression</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-9</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="level_of_aggression"
                    css={inputField}
                    placeholder=""
                    value={values.level_of_aggression || ""}
                    onChange={handleChange}
                  />
                  <span style={{color: "red"}}>{errors.level_of_aggression}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Self-Harm</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-3</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="client_self_harm"
                    css={inputField}
                    placeholder=""
                    value={values.client_self_harm || ""}
                    onChange={handleChange}
                  />
                  <span style={{color: "red"}}>{errors.client_self_harm}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Trauma Assessment Score</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-40</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="Screening_tool_Trauma"
                    css={inputField}
                    placeholder=""
                    value={values.Screening_tool_Trauma || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.Screening_tool_Trauma}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Life Functioning</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-39</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_LifeFunctioning"
                    css={inputField}
                    placeholder=""
                    value={values.cans_LifeFunctioning || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_LifeFunctioning}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Youth Strengths</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-33</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_YouthStrengths"
                    css={inputField}
                    placeholder=""
                    value={values.cans_YouthStrengths || ""}
                    onChange={handleChange}
                  />
                  <span style={{color: "red"}}>{errors.cans_YouthStrengths}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Caregiver Strengths</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-54</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_CareGiverStrengths"
                    css={inputField}
                    placeholder=""
                    value={values.cans_CareGiverStrengths || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_CareGiverStrengths}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Culture</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-12</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_Culture"
                    css={inputField}
                    placeholder=""
                    value={values.cans_Culture || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_Culture}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Youth Behavior</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-30</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_YouthBehavior"
                    css={inputField}
                    placeholder=""
                    value={values.cans_YouthBehavior || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_YouthBehavior}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Youth Risk</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-36</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_YouthRisk"
                    css={inputField}
                    placeholder=""
                    value={values.cans_YouthRisk || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_YouthRisk}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>CANS Trauma Experience</label>
                  <label style={{display:"flex",fontSize:"14px"}}>Range should be 0-36</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="cans_Trauma_Exp"
                    css={inputField}
                    placeholder=""
                    value={values.cans_Trauma_Exp || ""}
                    onChange={handleChange}
                  />
                   <span style={{color: "red"}}>{errors.cans_Trauma_Exp}</span>
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label} htmlFor="inclusionary_criteria">
                    Does this client meet inclusionary criteria for a sexual
                    offense program?
                  </label>
                </div>
                <div css={twoCol}>
                  <input
                    type="checkbox"
                    name="inclusionary_criteria"
                    id="inclusionary_criteria"
                    // css={inputField}
                    checked={values.inclusionary_criteria}
                    value="true"
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="inclusionary_criteria" />
                </div>
              </div>
              <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  style={{ marginRight: 10 }}
                  onClick={() => history.push(`/${domainPath}/new-client`)}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                >
                  Submit For FirstMatch Prediction
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

export default PredictionFormStep2;
