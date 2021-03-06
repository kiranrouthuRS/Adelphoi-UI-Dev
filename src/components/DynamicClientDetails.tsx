/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";
import { format } from "date-fns";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
// import * as referral from "../redux-modules/referral";
// import ReferralList from "../components/ReferralList";
import {
  label,
  backdrop,
  selectField,
  subHeading,
  fieldRow,
  inputField,
  twoCol,
  txtLabel,
  panel,
  panelHeading,
  panelHeader,
  txtDetail,
  fieldBox,
  fieldBox1
} from "./styles";
import Dropdown from "./Dropdown";
import * as Types from "../api/definitions";
import { baseApiUrl } from "../api/api";
import color from "@material-ui/core/colors/amber";
import { domainPath } from "../App"

interface DynamicClientDetailsProps {
  client: any;
  index: any;
  onProgramSelect: (
    client_code: string,
    selected_program: string,
    values: any
  ) => Promise<void>;
  onVersionSelect: (
    client_code: string,
    version: string
  ) => Promise<void>;
  onFormSubmit: (
    client_code: string,
    program_completion: number | null,
    returned_to_care: number | null,
    //roc_confidence: number | null,
    program_significantly_modified: number,
    Program: string | null,
    Location: string | null,
    start_date: any | null,
    end_date: any | null,
    referral_status: any | null,

    //Referral: string | null
  ) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  searchData: any;
  program_completion_response: string | null;
  // getReferral: () => Promise<void>;
  Referral: Types.Referral[],
  is_role_type: string,
  is_prediction_available: string
}

interface FormValues {
  Program_Completion: string | number | null;
  Returned_to_Care: string | number | null;
  program_significantly_modified: number | string | null;
  Program: any;
  start_date: string;
  end_date: string;
  referral_status: any;
  confidence: string;
  roc_confidence: string;
  Location: any;
  Referral: any;

}

const DynamicClientDetails: React.FC<DynamicClientDetailsProps> = props => {
  const history = useHistory();
  const [predicted_program, setPredictedProgram] = useState<string | null>(
    null
  );
  const [predicted_referral, setPredictedReferral] = useState<string | null>(
    null
  );

  const [predicted_location, setPredictedLocation] = useState<string | null>(
    null
  );

  const [SelectedVersion, setSelectedVersion] = useState<any | null>(
    null
  );

  const [version_changed, setVersion] = useState<any | null>(
    null
  );
 
  useEffect(() => {
    if (
      !SelectedVersion ||
      SelectedVersion === props.searchData
    ) {
      const length = props.searchData.length - 1
      setSelectedVersion([searchData[length]]);
    }
  }, [props.searchData]);

  useEffect(() => {
    if (
      !predicted_program ||
      predicted_program === props.client.selected_program
    ) {
      setPredictedProgram(searchData[0].model_program);
    }
  }, [props.client.selected_program,]);
  useEffect(() => {
    if (
      !predicted_referral ||
      predicted_referral === props.client.selected_referral
    ) {
      setPredictedReferral(props.client.selected_referral);
    }
  }, [props.client.selected_referral]);


  useEffect(() => {
    if (
      !predicted_location ||
      predicted_location === props.client.selected_location
    ) {
      setPredictedLocation(props.client.selected_location);
    }
  }, [props.client.selected_location]);

  const onProgramChange = (program: any, values: any) => {
    props.onProgramSelect(props.searchData[0].client_code!, program.value, values);
  };

  let { index } = useParams();
  if (!index) {
    return <h1 css={subHeading}>No client found</h1>;
  }
  const { client, Referral, searchData } = props;
  const programOptions = props.client.SuggestedPrograms
    ? props.client.SuggestedPrograms.map(p => {
      return {
        label: p,
        value: p,
        predicted: p === predicted_program
      };
    })
    : [];
const locationOptions = props.client.SuggestedLocations
    ? props.client.SuggestedLocations.map(l => {
      return {
        label: l,
        value: l,
        predicted: l === predicted_location
      };
    })
    : [];
  const getInitialValues = (): FormValues => {
    const { client, is_role_type, searchData } = props;
    let program: any = null;
    let location: any = null;
    let referral: any = null;
    let start_date: any = null;
    let end_date: any = null;
    let referral_status: any = null;
    let role_type: any = is_role_type;
    if (client.selected_referral) {
      referral = {
        label: client.selected_referral,
        value: client.selected_referral,
        predicted: client.selected_referral === predicted_referral
      };
    }
    if (client.selected_program) {
      program = {
        label: client.selected_program,
        value: client.selected_program,
        predicted: client.selected_program === predicted_program
      };
    }
    if (client.selected_location) {
      location = {
        label: client.selected_location,
        value: client.selected_location,
        predicted: client.selected_location === predicted_location
      };
    }
    return {
       Program_Completion:
       client.Program_Completion === null 
          ? ""
          : client.Program_Completion&&client.Program_Completion.toString(),
      Returned_to_Care:
        client.Returned_to_Care === null
          ? ""
          : client.Returned_to_Care&&client.Returned_to_Care.toString(),
      program_significantly_modified: Number(
        client.program_significantly_modified
      ),
      roc_confidence:
      client.roc_confidence&&client.roc_confidence !== null ? client.roc_confidence.toString() : "",
      Program: program,
      Referral: referral,


      confidence:
      client.confidence&&client.confidence !== null ? client.confidence.toString() : "",
      Location: location || "",

      start_date:
        client.start_date !== null ? client.start_date : "",

      end_date:
        client.end_date !== null ? client.end_date : "",

      referral_status:
        client.referral_status !== null ? client.referral_status : ""
    };

  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    var optionElement = e.target.childNodes[e.target.selectedIndex]
    let version_id = optionElement.getAttribute('data-id');
    const val = searchData.filter((sec, i) => sec.version === value && sec)
    setSelectedVersion(val);
    setVersion(!version_id ? false : true); 
    setPredictedProgram(val[0].client_selected_program);
    setPredictedReferral(val[0].selected_referral);
    setPredictedLocation(val[0].client_selected_locations);
    props.onVersionSelect(props.searchData[0].client_code,version_id);
  
  }

  const display = (id, ver) => {
    const tempArray = [] as any;
    let questions = SelectedVersion && SelectedVersion[0].sections[id].questions
    const length: any = questions && questions.length
    for (let i = 0; i < length; i++) {
      if ((i + 1) % 2 !== 0) {
        var tempArray1 = [] as any;
        tempArray1.push(questions[i]);
        if (length === i + 1) {
          tempArray.push(tempArray1)
        }
      }
      else {
        tempArray1.push(questions[i]);
        tempArray.push(tempArray1)
      }

    }
    return tempArray

  }
return (
    <div>
      <Backdrop css={backdrop} open={props.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {props.is_role_type === "Contributor" ? "" : (
        <div css={fieldRow}>
          <div css={twoCol}>&nbsp;</div>
          <div
            css={twoCol} >
            <div css={txtDetail}>
              <select
                css={selectField}
                name="versions"
                onChange={handleChange}
              >
                <option value="">Select Version</option>
                {searchData.map((data, i) =>
                  <option key={i} data-id={searchData.length - 1 === i ? "":i} 
                  value={data.version} 

                  selected={data.version === searchData[searchData.length - 1].version}>
                    {data.date_created}
                  </option>
                )}
              </select>
            </div>
          </div>
          <div
            css={twoCol}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              textAlign: "center",
              paddingTop: 13,
              paddingBottom: 20
            }}
          >
            <a
              rel="noopener noreferrer"
              target="_blank"
              css={txtDetail}
              href={`${baseApiUrl}/${domainPath}/index/${client.client_code}`}
            >
              <PictureAsPdfIcon /> Download Report
        </a>
          </div>
        </div>
      )}
      {
        SelectedVersion && SelectedVersion[0].sections.map((ques, id) =>
          <Accordion defaultExpanded={id === 0 ? true : false}>
            <AccordionSummary
              css={panelHeader}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <h1 css={panelHeading}>{ques.section}</h1>
            </AccordionSummary>
            <AccordionDetails css={panel}>
              {display(id, SelectedVersion).map((item, index) => {
                return <div css={fieldRow}>{item.map((ques, index_1) => {
                  return <div css={twoCol}>
                    <label css={txtLabel}>{ques.question}</label> 
                    <div css={txtDetail}>
                      {ques.question === "Age"?props.searchData[0].ageAtEpisodeStart?props.searchData[0].ageAtEpisodeStart:ques.answer:ques.answer}
                    </div>
                  </div>
                })}
                </div>
              })
              }

            </AccordionDetails>
          </Accordion>


        )
      }
      <h3> Click <a href="#" onClick={() =>
        history.push(
          `/${domainPath}/existing-client/edit-details/${index}&true`
        )
      }><u style={{ color: "red" }}>here</u></a> to update latest version of Client details.</h3>

      {props.is_role_type === "Contributor" || !props.is_prediction_available? "" : (
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize
          validate={values => {
            const errors: FormikErrors<FormValues> = {};
            
           if (values.Program !== predicted_program) {
            if (!values.Location) {
                errors.Location = "Required";
              }
              if (!values.referral_status) {
                errors.referral_status = "Required";
              }
              if (values.referral_status === "placed") {
                if (!values.start_date) {
                  errors.start_date = "Required"; 
                } 
              }
              
            }
            if (values.Program_Completion === "1") {
              if (!values.end_date) {
                errors.end_date = "Required";
              }

            }
            return errors;
          }}

          onSubmit={async (values, helpers) => {
            if (!searchData[0].client_code) {
              return false;
            }
            const Program_Completion =
              values.Program_Completion === ""
                ? null
                : Number(values.Program_Completion);
            const Returned_to_Care =
              values.Returned_to_Care === ""
                ? null
                : Number(values.Returned_to_Care);
            const start_date =
              values.start_date === ""
                ? null
                : values.referral_status !== "placed"?null:values.start_date;
            const end_date =
              values.end_date === ""
                ? null
                : values.end_date;
            const referral_status =
              values.referral_status === ""
                ? null
                : values.referral_status;
            await props.onFormSubmit(
              searchData[0].client_code,
              Program_Completion,
              Returned_to_Care,
              Number(values.program_significantly_modified),
              values.Program!.value!,
              values.Location!.value!,
              start_date,
              end_date,
              referral_status

              // values.Referral!.value!,
              //values.roc_confidence!.value!
            );
            helpers.resetForm();
          }}
        >
          {({ values, handleSubmit, handleChange }) => (

            <form
              name="clientDetailsForm"
              onSubmit={handleSubmit}
              style={{ marginTop: 20 }}
            >
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label} htmlFor="program_significantly_modified">
                    Referral Status
                </label>
                </div>
                <div css={twoCol}>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="referral_status"
                      value="placed"
                      disabled = {version_changed} 
                      checked={
                        values.referral_status !== null
                          ? values.referral_status === "placed"
                          : false
                      }
                    />
                    <label >Placed</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      disabled = {version_changed} 
                      name="referral_status"
                      value="not_placed"
                      checked={
                        values.referral_status !== null
                          ? values.referral_status === "not_placed"
                          : false
                      }
                    />
                    <label >Not Placed</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      disabled = {version_changed} 
                      name="referral_status"
                      value="rejected"
                      checked={
                        values.referral_status !== null
                          ? values.referral_status === "rejected"
                          : false
                      }
                    />
                    <label >Rejected</label>
                  </div>
                  <ErrorMessage
                    component="span"
                    name="referral_status"
                  />
                </div>
                
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Program</label>
                </div>
                <div css={twoCol}>
                  <Dropdown
                    name="Program"
                    disabled={version_changed ? version_changed : values.Program_Completion !== ""} 
                    options={programOptions}
                    onChange={(p: any) => onProgramChange(p, values)}
                    defaultValue={programOptions.find(
                      p => p.value === predicted_program
                    )}
                    value={values.Program || null}
                  />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Location</label>  
                </div>
                <div css={twoCol}>
                  <Dropdown
                    name="Location"
                    disabled={version_changed ? version_changed :values.Program_Completion !== ""}
                    options={locationOptions}
                     // onChange={(p: any) => onLocationChange(p, values)}
                    defaultValue={locationOptions.find(
                      l => l.value === predicted_location
                    )}
                    value={values.Location || null}
                  />
                     </div>
              </div>
              {values.referral_status === "placed" && 
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Start Date</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="date"
                    name="start_date"
                    disabled = {version_changed}  
                   css={inputField}
                    placeholder=""
                    value={values.start_date || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="start_date" />

                </div>
              </div>
               }
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Program Completion Likelihood</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="confidence"
                    readOnly
                    disabled = {version_changed}
                    css={inputField}
                    // disabled={Number(values.Program_Completion) === 0}
                    placeholder=""
                    value={values.confidence || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="confidence" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Remain out of care Likelihood</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="text"
                    name="roc_confidence"
                    readOnly
                    disabled = {version_changed}
                    css={inputField}
                    // disabled={Number(values.Program_Completion) === 0}
                    placeholder=""
                    value={values.roc_confidence || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="roc_confidence" />
                </div>
              </div>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Program Completion</label>
                </div>
                <div css={twoCol}>
                  <select
                    css={selectField}
                    onChange={handleChange}
                    disabled = {version_changed}
                    name="Program_Completion"
                    value={
                      values.Program_Completion !== null
                        ? values.Program_Completion && values.Program_Completion.toString()
                        : ""
                    }
                  >
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <ErrorMessage component="span" name="Program_Completion" />
                </div>
              </div>
              {values.Program_Completion === "1" &&
                <div css={fieldRow}>
                  <div css={twoCol}>
                    <label css={label}>End Date</label>
                  </div>
                  <div css={twoCol}>
                    <input
                      type="date"
                      name="end_date"
                      disabled = {version_changed}
                      css={inputField}
                      // disabled={Number(values.Program_Completion) === 0}
                      placeholder=""
                      value={values.end_date || ""}
                      onChange={handleChange}
                    />
                    <ErrorMessage component="span" name="end_date" />
                  </div>
                </div>
              }
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label} htmlFor="program_significantly_modified">
                    Was the program significantly modified to treat this client?
                </label>
                </div>
                <div css={twoCol}>
                  <div css={fieldBox}>
                    <input
                      type="checkbox"
                      disabled={
                        version_changed ? version_changed : values.Program_Completion !== ""
                          ? values.Program_Completion === "0"
                          : true
                      }
                      onChange={handleChange}
                      name="program_significantly_modified"
                      id="program_significantly_modified"
                      value="true"
                      checked={
                        values.program_significantly_modified !== null
                          ? Number(values.program_significantly_modified) === 1
                          : false
                      }
                    />
                  </div>
                  <ErrorMessage
                    component="span"
                    name="program_significantly_modified"
                  />
                </div>
              </div>
              
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Remained out of care</label>
                </div>
                <div css={twoCol}>
                  <select
                    css={selectField}
                    onChange={handleChange}
                    disabled={
                     version_changed ? version_changed : values.Program_Completion !== ""
                        ? values.Program_Completion === "0"
                        : true
                    }
                    name="Returned_to_Care"
                    value={
                      values.Returned_to_Care !== null
                        ? values.Returned_to_Care && values.Returned_to_Care.toString()
                        : ""
                    }
                  >
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <ErrorMessage component="span" name="Returned_to_Care" />
              </div>

              <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled = {version_changed}
                >
                  Submit
              </Button>
              </div>
            </form>
          )}
        </Formik>)}
      {props.program_completion_response && (
        <div css={subHeading}>{props.program_completion_response}</div>
      )}

    </div>
  );
};

export default DynamicClientDetails;
