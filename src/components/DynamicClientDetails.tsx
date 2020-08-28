/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";
import { format } from "date-fns";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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
  fieldBox
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
  onFormSubmit: (
    client_code: string,
    program_completion: number | null,
    returned_to_care: number | null,
    //roc_confidence: number | null,
    program_significantly_modified: number,
    Program: string | null,
    Location: string | null,
    //Referral: string | null
  ) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  searchData: any;
  program_completion_response: string | null;
  // getReferral: () => Promise<void>;
  Referral: Types.Referral[],
  is_role_type: string
}

interface FormValues {
  Program_Completion: string | number | null;
  Returned_to_Care: string | number | null;
  program_significantly_modified: number | string | null;
  Program: any;
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
      setPredictedProgram(props.client.model_program);
    }
  }, [props.client.selected_program]);
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
    props.onProgramSelect(props.client.client_code!, program.value, values);
  };

  let { index } = useParams();
  if (!index) {
    return <h1 css={subHeading}>No client found</h1>;
  }
  const { client, Referral, searchData } = props;


  const getInitialValues = () => {
    const { client, is_role_type } = props;
    let program: any = null;
    let location: any = null;
    let referral: any = null;

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = searchData.filter((sec, i) => sec.version === value && sec)
    setSelectedVersion(val)
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

                  <option key={i} value={data.version} selected={data.version === searchData[searchData.length - 1].version}>{data.date_created}</option>


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
          <ExpansionPanel defaultExpanded={id === 0 ? true : false}>
            <ExpansionPanelSummary
              css={panelHeader}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <h1 css={panelHeading}>{ques.section}</h1>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails css={panel}>
              {display(id, SelectedVersion).map((item, index) => {
                return <div css={fieldRow}>{item.map((item_1, index_1) => {
                  return <div css={twoCol}>
                    <label css={txtLabel}>{item_1.question}</label>
                    <div css={txtDetail}>
                      {item_1.answer}
                    </div>
                  </div>
                })}
                </div>
              })
              }

            </ExpansionPanelDetails>
          </ExpansionPanel>


        )
      }
      <h3> Click <a href="#" onClick={() =>
        history.push(
          `/${domainPath}/existing-client/edit-details/${index}&true`
        )
      }><u style={{ color: "red" }}>here</u></a> to update latest version of Client details.</h3>


    </div>
  );
};

export default DynamicClientDetails;
