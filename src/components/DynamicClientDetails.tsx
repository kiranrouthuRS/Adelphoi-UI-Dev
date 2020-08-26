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
  const { client, Referral } = props;
  // const programOptions = props.client.SuggestedPrograms
  //   ? props.client.SuggestedPrograms.map(p => {
  //     return {
  //       label: p,
  //       value: p,
  //       predicted: p === predicted_program
  //     };
  //   })
  //   : [];


  // const locationOptions = props.client.SuggestedLocations
  //   ? props.client.SuggestedLocations.map(l => {
  //     return {
  //       label: l,
  //       value: l,
  //       predicted: l === predicted_location
  //     };
  //   })
  //   : [];

  const getInitialValues = () => {
    const { client, is_role_type } = props;
    let program: any = null;
    let location: any = null;
    let referral: any = null;

    // if (client.selected_referral) {
    //   referral = {
    //     label: client.selected_referral,
    //     value: client.selected_referral,
    //     predicted: client.selected_referral === predicted_referral
    //   };
    // }
    // if (client.selected_program) {
    //   program = {
    //     label: client.selected_program,
    //     value: client.selected_program,
    //     predicted: client.selected_program === predicted_program
    //   };
    // }
    // if (client.selected_location) {
    //   location = {
    //     label: client.selected_location,
    //     value: client.selected_location,
    //     predicted: client.selected_location === predicted_location
    //   };
    // }
    // return {
    //   Program_Completion:
    //     client.Program_Completion === null
    //       ? ""
    //       : client.Program_Completion.toString(),
    //   Returned_to_Care:
    //     client.Returned_to_Care === null
    //       ? ""
    //       : client.Returned_to_Care.toString(),
    //   program_significantly_modified: Number(
    //     client.program_significantly_modified
    //   ),
    //   roc_confidence:
    //     client.roc_confidence !== null ? client.roc_confidence.toString() : "",
    //   Program: program,
    //   Referral: referral,


    //   confidence:
    //     client.confidence !== null ? client.confidence.toString() : "",
    //   Location: location || ""
    // };
  };
  const display = (id) => {
    const tempArray = [] as any;
    let questions = client[id] && client[id].hasOwnProperty("section") ? client[id].questions : ""
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            textAlign: "right",
            paddingTop: 20,
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
      )}
      {
        Object.keys(client).map((key, id) =>
          client[key] && client[key].hasOwnProperty("section") ?
            <ExpansionPanel defaultExpanded={id === 0 ? true : false}>
              <ExpansionPanelSummary
                css={panelHeader}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <h1 css={panelHeading}>{client[key].section}</h1>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails css={panel}>
                {display(id).map((item, index) => {
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
            : ""
        )
      }
      <h3> Click <a onClick={() =>
        history.push(
          `/${domainPath}/existing-client/edit-details/${index},true`
        )
      }><u style={{ color: "red" }}>here</u></a> to Edit Client details Or update below details.</h3>


    </div>
  );
};

export default DynamicClientDetails;
