import React from "react";
import { connect } from "react-redux";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { wrap, mainContent } from "../components/styles";
import { AppState } from "../redux-modules/root";
import * as program from "../redux-modules/program";
import * as referral from "../redux-modules/referral";
import ReferralList from "../components/ReferralList";
import { ContainerProps } from "./Container";
import * as client from "../redux-modules/client";
import * as dynamicclient from "../redux-modules/dynamicclient";
import * as Types from "../api/definitions";
import DynamicClientDetails from "../components/DynamicClientDetails";
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

export interface DynamicClientDetailsContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
  program_completion_response: string | null;
}

export interface DynamicClientDetailsContainerProps
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
  searchClient: (client_code: string, client_name: string) => Promise<void>;
  updateProgramCompletion: (
    client_code: string,
    program_completion: number | null,
    returned_to_care: number | null,
    Remained_Out_of_Care: number | null,
    program_significantly_modified: number,
    program: string | null,
    location: string | null,
    start_date: string | null,
    end_date: string | null,
    referral_status: string | null,
    confidence: number, 
    roc_confidence: number
  ) => Promise<string>;
  // getAvailablePrograms: () => Promise<void>;
  submitPrediction: (client: Types.Client) => Promise<void>;
  getLocations: (
    client_code: string,
    selected_program: string,
    is_accessToken: any
  ) => Promise<void>;
  getPcr: (client_code: string, selected_program: string) => Promise<void>;
  DsaveLocationAndProgram: (
    selected_location: string,
    selected_program: string,
    client_code: string
  ) => Promise<void>;
  clearErrors: () => void;
  clearClient: () => void;
  getProgramsForClient: (client_code: string, version: string) => Promise<void>;
  updateFormValues: (client_code: string, values: any) => void;
  // getReferral: () => Promise<void>;
  Referral: Types.Referral[];
}

export class DynamicClientDetailsContainer extends React.Component<
  DynamicClientDetailsContainerProps,
  DynamicClientDetailsContainerState
  > {
  constructor(props: DynamicClientDetailsContainerProps) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: "",
      program_completion_response: null
    };
  }

  async componentDidMount() {
    this.loadClientDetails();
  }

  loadClientDetails = async () => {
    const { client: clientState } = this.props;
    const clientList = (clientState && clientState.clientList) || {};
    const { index } = this.props.match.params;
    this.setState({ isLoading: true });
    let version = ""
    if (!clientList[index]) {
      await this.searchClient(index, "");
    }
    // fetch program for this client
    await this.props.getProgramsForClient(index, version);
    this.setState({ isLoading: false });
    this.props.closeSnackbar();
    // this.props.getAvailablePrograms();
    // this.props.getReferral();
  }

  searchClient = async (client_code: string, client_name: string) => {
    await this.props.searchClient(client_code, client_name);
  };

  updateProgramCompletion = async (
    client_code: string,
    program_completion: number | null,
    returned_to_care: number | null,
    Remained_Out_of_Care: number | null,
    program_significantly_modified: number,
    program: string | null,
    location: string | null,
    start_date: string | null,
    end_date: string | null,
    referral_status: string | null,
    confidence: number ,
    roc_confidence: number 
  ) => {
    try {
      this.setState({ isLoading: true });
      const response = await this.props.updateProgramCompletion(
        client_code,
        program_completion,
        returned_to_care,
        Remained_Out_of_Care,
        program_significantly_modified,
        program,
        location,
        start_date,
        end_date,
        referral_status,
        confidence,
        roc_confidence
      );
      this.setState({
        isLoading: false
        // program_completion_response: response
      });
      this.props.enqueueSnackbar("Data saved successfully.");
      
    } catch (error) {
      this.setState({
        isLoading: false
        // program_completion_response: "An error occured. Please try again."
      });
      this.props.enqueueSnackbar("An error occured. Please try again.");
    }
  };

  getLocationsAndPcr = async (
    client_code: string,
    selected_program: string,
    values: any
  ) => {
    this.setState({ isLoading: true });
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    await this.props.getPcr(client_code, selected_program);
    await this.props.getLocations(client_code, selected_program, is_accessToken);
    this.props.updateFormValues(client_code, values);
    this.setState({ isLoading: false });
  };
  getVersionDetails = async (client_code: string, version: string) => {
    this.setState({ isLoading: true });
    await this.props.getProgramsForClient(client_code, version);
    this.setState({ isLoading: false });
  };
  submitProgram = async (client: Types.Client) => {

    // const { client: clientState } = this.props;
    // if (!clientState || !clientState.client) {
    //   return false;
    // }
    if (!client.client_code) {
      this.props.enqueueSnackbar(
        "Error. Client information is required to process this form."
      );
      return false;
    }
    try {
      this.setState({ isLoading: true });
      await this.props.submitPrediction(client);
    } catch (error) {
      let errorMessage: string = "An error occurred while saving.";
      if (error["referred_program"]) {
        errorMessage = error["referred_program"][0];
      } else if (error.message) {
        errorMessage = error.message;
      }
      this.props.enqueueSnackbar(errorMessage);
    }
    this.setState({ isLoading: false });
  };

  render() {
    const { client: clientState,
      referral: referralState } = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const clientList = (clientState && clientState.clientList) || {};
    const { index } = this.props.match.params;
    const { is_prediction_available }: any = this.props.user && this.props.user.user;
    const is_role_type: any = this.props.user && this.props.user.user.role_type
     const searchData: any = this.props && this.props.client && this.props.client.searchData && this.props.client.searchData
    
    return (
      <div css={wrap}>
        <div css={mainContent}>
          {!clientList[index] ? null : (
            <DynamicClientDetails
              is_role_type={is_role_type}
              is_prediction_available={is_prediction_available}
              client={clientList[index]}
              index={index}
              searchData={searchData.filter(s => s.client_code == index)}
              onProgramSelect={this.getLocationsAndPcr}
              onVersionSelect={this.getVersionDetails}
              // onLocationSelect={this.saveProgramAndLocation}
              {...this.state}
              Referral={referralList}
              onFormSubmit={this.updateProgramCompletion}
              program_completion_response={
                this.state.program_completion_response
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    client: state.client,
    program: state.program,
    referral: state.referral,
    user: state.user
  };
};

const mapDispatchToProps = {
  // getReferral: referral.actions.getReferral,
  searchClient: client.actions.searchClient,
  updateProgramCompletion: dynamicclient.actions.updateProgramCompletion,
  // getAvailablePrograms: program.actions.getAvailablePrograms,
  submitPrediction: client.actions.submitPrediction,
  getLocations: dynamicclient.actions.getLocations,
  getPcr: dynamicclient.actions.getPcr,
  saveLocationAndProgram: dynamicclient.actions.saveLocationAndProgram,
  clearErrors: client.actions.clearErrors,
  clearClient: client.actions.clear,
  getProgramsForClient: dynamicclient.actions.getProgramsForClient,
  updateFormValues: dynamicclient.actions.updateFormValues
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DynamicClientDetailsContainer));
