/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";
import { format, getMonth } from "date-fns";
import Modal from "react-modal";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

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
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -110%)'
  }
};
interface DynamicClientDetails_PersuesProps {
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
    Remained_Out_of_Care: number | null,
   program_significantly_modified: number,
   client_psychiatrically_hospitalized: number,
    Program: string | null,
    discharge_location: string | null,
    start_date: any | null,
    end_date: any | null,
    referral_status: any | null,
    length_of_stay: any, 
    Reason_for_rejected: any ,
    Reason_not_accepted: any ,
    client_recidivate: any
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
  Program_Completion: string | number | any; 
  Reason_not_accepted: string | number | any;
  Reason_for_rejected: string | number | any;
  Remained_Out_of_Care: string | number | null;
  program_significantly_modified: number | string | null;
  client_psychiatrically_hospitalized: number | string | null;
  Program: any;
  start_date: string;
  end_date: string;
  referral_status: any;
  discharge_location: any;
  client_recidivate: any;
  length_of_stay: any;

}

const DynamicClientDetails_Persues: React.FC<DynamicClientDetails_PersuesProps> = props => {
  const history = useHistory();
  const [modalIsOpen,setIsOpen] = useState(false);
  const [predicted_program, setPredictedProgram] = useState<string | null>(
    null
  );
  const [predicted_referral, setPredictedReferral] = useState<string | null>(
    null
  );
  const [referralStatus, setReferralStatus] = useState<string | null>(
    null
  ); 
  const [startDate, setStartDate] = useState<string | null>(
    null
  );
  const [endDate, setEndDate] = useState<string | null>(
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
  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal(){
    setIsOpen(false);
    
  }
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
      predicted_program === props.client.Program
    ) {
      setPredictedProgram(props.client.Program);
      
    }
  }, [props.client.Program]);
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
     setReferralStatus(values.referral_status)
    props.onProgramSelect(props.searchData[0].client_code!, program.value, values);
  };

  let { index } = useParams();
  if (!index) {
    return <h1 css={subHeading} >No client found</h1>;
  }
  const { client, Referral, searchData } = props;
  let suggested_locations : any = props.client.SuggestedLocations?.length > 0 ? 
                                               props.client.SuggestedLocations : 
                                               props.client["Suggested Locations"]
 const programOptions = props.client.SuggestedPrograms
    ? props.client.SuggestedPrograms.map(p => {
      return {
        label: p,
        value: p,
        predicted: p === predicted_program
      };
    })
    : [];
   
const locationOptions = suggested_locations
    ? suggested_locations.map(l => {
      return {
        label: l,
        value: l,
        predicted: l === predicted_location
      };
    }):
   []; 
  const getInitialValues = (): FormValues => {
    const { client, is_role_type, searchData } = props;
    let program: any = null;
    let location: any = null;
    let referral: any = null;
    if (client.selected_referral) {
      referral = {
        label: client.selected_referral,
        value: client.selected_referral,
        predicted: client.selected_referral === predicted_referral
      };
    }
    if (client.Program) {
      program = {
        label: client.Program,
        value: client.Program,
        predicted: client.Program === predicted_program
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
          : client.Program_Completion && client.Program_Completion.toString(),
      Reason_not_accepted:
      client.Reason_not_accepted === null 
      ? ""
      : client.Reason_not_accepted && client.Reason_not_accepted.toString(),
      Reason_for_rejected:
      client.Reason_for_rejected === null 
      ? ""
      : client.Reason_for_rejected && client.Reason_for_rejected.toString(),
      length_of_stay:
      client.length_of_stay === null
          ? ""
          : client.length_of_stay && client.length_of_stay.toString(),
      discharge_location:
      client.discharge_location === null
          ? ""
          : client.discharge_location && client.discharge_location.toString(),
      client_recidivate:
          client.client_recidivate === null
          ? ""
          : client.client_recidivate && client.client_recidivate.toString(),
      Remained_Out_of_Care:
          client.Remained_Out_of_Care === null 
          ? ""
          : client.Remained_Out_of_Care === 0 ?client.Remained_Out_of_Care.toString():client.Remained_Out_of_Care&&client.Remained_Out_of_Care.toString(),
      
      program_significantly_modified: Number(
        client.program_significantly_modified
      ),
      client_psychiatrically_hospitalized: 
        client.client_psychiatrically_hospitalized === "" 
        ? ""
        : client.client_psychiatrically_hospitalized 
      ,
      Program: program,
      start_date:
        client.start_date !== null ? startDate ? startDate : client.start_date : "",

      end_date:
        client.end_date !== null ? endDate ? endDate : client.end_date : "",

      referral_status:
        client.referral_status !== null ? referralStatus ? referralStatus: client.referral_status : ""
    };
    
  };
  
   const versionChange = (e) => {
    const { name, value } = e.target;
    var optionElement = e.target.childNodes[e.target.selectedIndex]
    let version_id = optionElement.getAttribute('data-id');
    const Version = searchData.filter((sec, i) => sec.version === value && sec)
    setSelectedVersion(Version);
    setVersion(!version_id ? false : true); 
    setPredictedProgram(Version[0].Program); 
    setPredictedReferral(Version[0].selected_referral);
    setPredictedLocation(Version[0].client_selected_locations);
    setReferralStatus(Version[0].referral_status);
    setStartDate(Version[0].start_date);
    setEndDate(Version[0].end_date);
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
  const is_date = function(date) {
     let dateObj: any = new Date(date.replace(/-/g, '\/'));   
    const regex=new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})"); 
   if(regex.test(date)){
      let year = dateObj.getFullYear();
        let month = 1 + (dateObj.getMonth())
        let datee = dateObj.getDate();
        let date1 = [ month.toString().length>1 ?month:`0${month}`, datee, year].join("-")
        
    return date1
    }
    return date;   
      };

      function get_length_of_stay (startDate,endDate)  {
       let ONE_WEEK = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        let date1_ms: any = new Date(startDate);
        let date2_ms: any = new Date(endDate);
        // Calculate the difference in milliseconds
        let difference_ms = Math.round(date2_ms - date1_ms);
        // Convert back to weeks and return hole weeks
        return Math.floor(difference_ms / ONE_WEEK);
        
      }
       
 return (
    <div>
      <Backdrop css={backdrop} open={props.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
        <div css={fieldRow}>
          <div css={twoCol}>&nbsp;</div>
          <div
            css={twoCol} >
            <div css={txtDetail}>
              <select
                css={selectField}
                name="versions"
                onChange={versionChange}
              >
                <option value="">Select Version</option>
                {searchData.map((data, i) =>
                  <option key={i} data-id={searchData.length - 1 === i ? "" : i} 
                  value={data.version} 

                  selected={data.version === searchData[searchData.length - 1].version}>
                    {data.date_created}
                  </option>
                )}
              </select>
            </div>
          </div>
          {!props.is_prediction_available ? "" :
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
}
        </div>
      
      {
        SelectedVersion && SelectedVersion[0].sections.map((ques, id) => ques.related === "false" &&
          <Accordion defaultExpanded={id === 0 ? true : false} key={id}> 
            <AccordionSummary
              css={panelHeader}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <h1 css={panelHeading}>{ques.section}</h1>
            </AccordionSummary>
            <AccordionDetails css={panel}>
              {display(id, SelectedVersion).map((item, index) => {
                return <div css={fieldRow} key={index}>{item.map((ques, index_1) =>  {
                  
                  return ques.related === "no" &&  <div css={twoCol} key={index_1}>
                    <label css={txtLabel}>{ques.question}</label>  
                    <div css={txtDetail}>
                      {Array.isArray(ques.answer)? ques.answer.toString(): 
                      ques.answer.toString().includes("-") ? is_date(ques.answer) :       
                      ques.question === "Age" ? props.searchData[0].ageAtEpisodeStart 
                                        ? props.searchData[0].ageAtEpisodeStart:
                      ques.answer:ques.answer} 
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
     
       {( props.client.referral_status === "not_placed" || 
          props.client.referral_status === "rejected" || 
          props.client.Program_Completion?.toString() === "1" ||
          ["8","9"].includes(props.client.discharge_location?.toString()) || props.client.Remained_Out_of_Care?.toString()) ? 
         (<h3> Click <a href="#" onClick={() =>  
          history.push(
            `/${domainPath}/existing-client/edit-details/${index}&true&true`  
          )
        }><u style={{ color: "red" }}>here</u></a> to Re-Refer the Client.</h3>)
        :
         (props.client.referral_status === "pending") && 
          (<h3> Click <a href="#" onClick={() =>
            history.push(
              `/${domainPath}/existing-client/edit-details/${index}&true&false`
            )
          }><u style={{ color: "red" }}>here</u></a> to update the Client details.</h3>)
          }
     

       <Formik
          initialValues={getInitialValues()}
          enableReinitialize 
          
          validate={ async(values) => {
            const errors: FormikErrors<FormValues> = {};
           if (!values.referral_status) {
              errors.referral_status = "Required";
            }
            if (values.referral_status === "placed") {
              if (!values.Program) {
                errors.Program = "Required"; 
              } 
                   if (!values.start_date) {
                errors.start_date = "Required"; 
              } 
            }
         
            if (values.referral_status === "not_placed") {
              if (!values.Reason_not_accepted) {
                errors.Reason_not_accepted = "Required"; 
              } 
            }
            if (values.referral_status === "rejected") {
              if (!values.Reason_for_rejected) {
                errors.Reason_for_rejected = "Required"; 
              } 
            }
          
            if (values.Program_Completion?.toString()) {
              if (!values.end_date) {
                errors.end_date = "Required";
              }else{
               let stay = await get_length_of_stay(values.start_date,values.end_date); 
               values.length_of_stay = stay; 
              }
              if (!values.discharge_location) {
                errors.discharge_location = "Required";
              }
              if (!values.client_psychiatrically_hospitalized) {
                errors.client_psychiatrically_hospitalized = "Required";
              }
            }
            if (values.Remained_Out_of_Care?.toString()) { 
              if (!values.client_recidivate) {
                errors.client_recidivate = "Required";
              }
            }
            return errors;
          }}
          onSubmit={async (values, helpers) => { 
            if(values.referral_status !== "pending" && !modalIsOpen){
              await openModal()
             
            } else {
           if (!searchData[0].client_code) {
              return false;
            }
            const Program_Completion =
              values.Program_Completion === ""
                ? null 
                : Number(values.Program_Completion);
            const Remained_Out_of_Care =
              values.Remained_Out_of_Care === ""
                ? null
                : Number(values.Remained_Out_of_Care); 
            const length_of_stay = 
              values.length_of_stay === ""
                ? null
                : values.length_of_stay; 
            const Reason_not_accepted  =
              values.Reason_not_accepted === ""
                ? null
                : values.referral_status !== "not_placed" ? null : Number(values.Reason_not_accepted);
            const Reason_for_rejected = 
             values.Reason_for_rejected === ""
                ? null
                : values.referral_status !== "rejected" ? null : Number(values.Reason_for_rejected);
            const discharge_location = 
            values.discharge_location === ""
              ? null
              : values.discharge_location; 
            const client_recidivate = 
            values.client_recidivate === ""
              ? null
              : values.client_recidivate;  
            const start_date =
              values.start_date === ""
                ? null
                : values.referral_status !== "placed" ? null : values.start_date;
            const end_date =
              values.end_date === ""
                ? null
                : values.end_date;
            const referral_status =
              values.referral_status === ""
                ? null
                : values.referral_status;
            const program =
                values.Program ? values.Program.length === 0
                 ? null
                 : values.Program!.value! : null
            setIsOpen(false)
            await props.onFormSubmit(
              searchData[0].client_code,
              Program_Completion,
              Remained_Out_of_Care,
              Number(values.program_significantly_modified),
              Number(values.client_psychiatrically_hospitalized),
              program,
              discharge_location,
              start_date,
              end_date,
              referral_status,
              length_of_stay, 
              Reason_not_accepted,
              Reason_for_rejected,
              client_recidivate
             );
            helpers.resetForm();
            }
          }}
        >
          {({ values, handleSubmit, handleChange, handleBlur }) => (

            <form
              name="clientDetailsForm"
              onSubmit={handleSubmit}
              style={{ marginTop: 20 }}
            >
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label} htmlFor="referral_status">
                    Referral Status
                </label>
                </div>
                <div css={twoCol}>
                <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      disabled = {version_changed || props.client.referral_status !== "pending"} 
                      name="referral_status"
                      value="pending"
                      checked={
                        values.referral_status !== null
                          ? values.referral_status === "pending"
                          : false
                      }
                    />
                    <label >Pending</label> 
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      name="referral_status"
                      value="placed"
                      disabled = {version_changed || props.client.referral_status !== "pending"} 
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
                      disabled = {version_changed || props.client.referral_status !== "pending"} 
                      name="referral_status"
                      value="not_placed"
                      checked={
                        values.referral_status !== null
                          ? values.referral_status === "not_placed"
                          : false
                      }
                    />
                    <label >Accepted - not placed</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      onChange={handleChange}
                      disabled = {version_changed || props.client.referral_status !== "pending"} 
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
              {values.referral_status === "placed" && 
                 <div css={fieldRow}>
                    <div css={twoCol}>
                      <label css={label}>Program</label>
                    </div>
                    <div css={twoCol}>
                      <Dropdown 
                        name="Program" 
                        disabled={version_changed ? version_changed : props.client.referral_status !== "pending" } 
                        options={programOptions}
                        // onChange={(p: any) => onProgramChange(p, values)}
                        defaultValue={programOptions.find(
                          p => p.value === predicted_program
                        )}
                        value={values.Program || null} 
                      />
                    </div>
                  </div>
                
              }
               {values.referral_status === "not_placed" && 
                 (
                  <div css={fieldRow}>
                  <div css={twoCol}>
                    <label css={label}>Reason Client was Not Placed</label>
                  </div>
                  <div css={twoCol}> 
                    <select
                      css={selectField} 
                      onChange={handleChange}
                      disabled={version_changed ? version_changed : props.client.referral_status !== "pending" }
                      name="Reason_not_accepted"
                      value={
                        values.Reason_not_accepted !== null 
                          ? values.Reason_not_accepted && values.Reason_not_accepted.toString()
                          : ""
                      }   
                    > 
                      <option value="">Select</option>
                      <option value="0">Bed Availability</option> 
                      <option value="1">County/Court placed client with another provider</option>
                      <option value="2">Insurance Denied</option>
                      <option value="3">Parent/Guardian chose other provider​</option>
                      <option value="4">Other​</option>
                    </select>
                    <ErrorMessage component="span" name="Reason_not_accepted" />
                  </div>
                </div>
                 )}
                 {values.referral_status === "rejected" && 
                 (
                  <div css={fieldRow}>
                  <div css={twoCol}>
                    <label css={label}>Reason for Rejection</label>
                  </div>
                  <div css={twoCol}> 
                    <select
                      css={selectField} 
                      onChange={handleChange}
                      name="Reason_for_rejected"
                      disabled={version_changed ? version_changed : props.client.referral_status !== "pending" }
                      value={
                        values.Reason_for_rejected !== null 
                          ? values.Reason_for_rejected && values.Reason_for_rejected.toString()
                          : ""
                      }   
                    > 
                      <option value="">Select</option>
                      <option value="0">Actively Psychotic</option> 
                      <option value="1">Chronic Health Concerns</option>
                      <option value="2">Fire Setting</option>
                      <option value="3">Low IQ​</option>
                      <option value="4">Needs One-to-One Staffing​</option>
                      <option value="5">Needs Single Room</option>
                      <option value="6">Requires Detox​</option>
                      <option value="7">Sexually Acting Out​</option>
                      <option value="8">Significant Aggression​</option>
                      <option value="9">Swallowing Non-food Objects</option>
                      <option value="10">Other​</option>
                    </select>
                    <ErrorMessage component="span" name="Reason_for_rejected" />
                  </div>
                </div>
                 )}
              {values.referral_status === "placed" && 
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Start Date</label>
                </div>
                <div css={twoCol}>
                  <input
                    type="date"
                    name="start_date"
                    disabled = {version_changed || props.client.referral_status !== "pending" }  
                   css={inputField}
                    placeholder=""
                    value={values.start_date || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="start_date" />

                </div>
              </div>
               }
          {values.referral_status === "placed" &&
          (<React.Fragment>
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Program Completion</label>
                </div>
                <div css={twoCol}> 
                  <select
                    css={selectField} 
                    onChange={handleChange}
                    disabled = {version_changed || [0,1,2,3].includes(props.client.Program_Completion)   ? true : values.referral_status !== "placed" } 
                    name="Program_Completion"
                    value={
                      values.Program_Completion !== null 
                        ? values.Program_Completion && values.Program_Completion.toString()
                        : ""
                    }   
                  > 
                    <option value="">Select</option>
                    <option value="0">Successful</option> 
                    <option value="1">Precipitous</option>
                  </select>
                  <ErrorMessage component="span" name="Program_Completion" />
                </div>
              </div>
              {(values.Program_Completion?.toString())  && 
                <div css={fieldRow}>
                  <div css={twoCol}>
                    <label css={label}>End Date</label>
                  </div>
                  <div css={twoCol}>
                    <input
                      type="date"
                      name="end_date" 
                      disabled = {version_changed || [0,1].includes(props.client.Program_Completion) }     
                      css={inputField}
                      // disabled={Number(values.Program_Completion) === 0}
                      placeholder=""
                      value={values.end_date || ""}
                      onChange={(e) => {values.length_of_stay = get_length_of_stay(values.start_date,e.target.value);
                                       handleChange(e)}}   
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
                      disabled={ version_changed }
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
              {(values.Program_Completion?.toString()) &&
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label} htmlFor="client_psychiatrically_hospitalized">
                  Was this client psychiatrically hospitalized during this treatment stay?
                </label>
                </div>
                <div css={twoCol}>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      disabled = {version_changed || [0,1].includes(props.client.Program_Completion) }  
                      onChange={handleChange}
                      name="client_psychiatrically_hospitalized"
                      id="client_psychiatrically_hospitalized"
                      value="1"
                      checked={
                        values.client_psychiatrically_hospitalized?.toString() === "1"
                      }
                    />
                    <label >Yes</label>
                  </div>
                  <div css={fieldBox}>
                    <input
                      type="radio"
                      disabled = {version_changed || [0,1].includes(props.client.Program_Completion) }  
                      onChange={handleChange}
                      name="client_psychiatrically_hospitalized"
                      id="client_psychiatrically_hospitalized"
                      value="0"
                      checked={
                        values.client_psychiatrically_hospitalized?.toString() === "0"
                      }
                    />
                     <label >No</label>
                  </div>
                  <ErrorMessage
                    component="span"
                    name="client_psychiatrically_hospitalized"
                  />
                </div>
              </div>
              }
              <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Length of Stay <small>(Days)</small></label>
                  
                </div>
                <div css={twoCol}> 
                  <input
                    type="text"
                    name="length_of_stay"
                    readOnly
                    disabled = {version_changed || [0,1].includes(props.client.Program_Completion) } 
                    css={inputField}
                    placeholder=""
                    value={values.length_of_stay || ""}
                  />
                  <ErrorMessage component="span" name="length_of_stay" />
                </div>
              </div>
              {(values.Program_Completion?.toString()) &&
              <div css={fieldRow}>
                  <div css={twoCol}>
                    <label css={label}>Discharge Location</label>
                  </div>
                  <div css={twoCol}> 
                    <select
                      css={selectField} 
                      onChange={handleChange}
                      disabled = {version_changed || [0,1].includes(props.client.Program_Completion) }  
                      name="discharge_location"
                      value={
                        values.discharge_location !== null 
                          ? values.discharge_location && values.discharge_location.toString()
                          : ""
                      }   
                    > 
                      <option value="">Select</option>
                      <option value="0">Home</option> 
                      <option value="1">Kinship Care</option>
                      <option value="2">Foster Care</option>
                      <option value="3">Group Home​</option>
                      <option value="4">ILP​</option>
                      <option value="5">Inpatient Hospitalization</option>
                      <option value="6">Shelter​</option>
                      <option value="7">Detention​</option>
                      <option value="8">Step Up – Internal Transfer​</option>
                      <option value="9">Step Down – Internal Transfer​</option>
                    </select>
                    <ErrorMessage component="span" name="discharge_location" />
                  </div>
                </div>
              } 
              {["8","9"].includes(values.discharge_location?.toString()) || values.Program_Completion?.toString() === "1" || (props.client.Program_Completion?.toString() !== "1")  &&
              (
              <div css={fieldRow}> 
                <div css={twoCol}>
                  <label css={label}>Remained Out of Care</label>
                </div>
                <div css={twoCol}>
                  <select
                    css={selectField}
                    onChange={handleChange}
                    disabled={ props.client.Remained_Out_of_Care?.toString() ? true :
                     version_changed 
                    }
                    name="Remained_Out_of_Care"
                    value={
                      values.Remained_Out_of_Care !== null
                        ? values.Remained_Out_of_Care?.toString()
                        : ""
                    }
                  >
                    <option value="">Select</option> 
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    
                  </select>
                </div>
               
                <ErrorMessage component="span" name="Remained_Out_of_Care" />
              </div>
               ) }
              {(values.Remained_Out_of_Care?.toString()) &&
                <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Did Client Recidivate?</label>
                </div>
                <div css={twoCol}>
                  <select
                    css={selectField}
                    onChange={handleChange}
                    name="client_recidivate"
                    disabled={ props.client.Remained_Out_of_Care?.toString() ? true :
                      version_changed 
                     }
                    value={
                      values.client_recidivate !== null 
                        ? values.client_recidivate && values.client_recidivate.toString()
                        : ""
                    } 
                  >
                    <option value="">Select</option> 
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                  </select>
                  <ErrorMessage component="span" name="client_recidivate" />
                </div>
                   
              </div>
             }
              
              </React.Fragment>
              )}
              <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"  
                  color="primary" 
                  disabled = {version_changed || values.referral_status === "pending" ||
                    ["not_placed","rejected"].includes(props.client.referral_status) 
                    || (props.client.Remained_Out_of_Care?.toString() || ["8","9"].includes(props.client.discharge_location?.toString()))}
                  
                >
                  Submit
              </Button>
              </div>
        <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose={closeModal} 
            style={customStyles}
            contentLabel="Example Modal"
          >
           <h3>Are you sure you want to submit? <br/> Submission will save this data into a version that cannot be changed</h3> 
           <div css={fieldRow} > 
           <div css={twoCol}>
               &nbsp;
              </div>
                <div css={twoCol}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled = {version_changed} 
                   onClick ={(e)=>handleSubmit()}
                >
                  Yes
              </Button>
              </div>
              <div css={twoCol}>
              <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled = {version_changed}
                  onClick= {(e)=> setIsOpen(false)}
                >
                  No
              </Button>
                </div>
                <div css={twoCol}>
                
              </div>
</div>
          </Modal>
            </form>
            
          )}
          
        </Formik>
        
      {props.program_completion_response && (
        <div css={subHeading}>{props.program_completion_response}</div>
      )}

    </div>
  );
};

export default DynamicClientDetails_Persues;
