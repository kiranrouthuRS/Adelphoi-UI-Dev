import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as Types from "../api/definitions";
import { AppState } from "../redux-modules/root";
import { ContainerProps } from "./Container";
import * as client from "../redux-modules/client";
import * as program from "../redux-modules/program";
import * as dynamicclient from "../redux-modules/dynamicclient";
import ReferralList from "../components/ReferralList";
import PredictionFormStep from "../components/PredictionFormStep";
import PredictionFormStep2 from "../components/PredictionFormStep2";
import ProgramSelection from "../components/ProgramSelection";
import { domainPath } from "../App"
import { store } from "../index";
interface MatchParams {
  index: string;
  Rerefer: string;
}
export interface DynamicNewClientContainerState {
  isLoading: boolean;
  error: any;
  hasError: boolean;
  isSuccess: boolean;
}

export interface DynamicClient {
  [key: string]: any;
}

export interface DynamicNewClientContainerProp
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
  saveClient: (
    client: Types.Client,
    page1FormCompleted?: boolean,
    excludePage2?: boolean
  ) => void;
  insertDClient: (client: Types.DynamicClient, is_accessToken: any) => Promise<void>;
  submitPrediction: (client: Types.Client) => Promise<void>;
  getLocations: (
    client_code: string,
    selected_program: string,
    is_accessToken: any
  ) => Promise<void>;
  getPcr: (client_code: string, selected_program: string) => Promise<void>;
  saveLocationAndProgram: (selected_location: string, pcr_score: any, roc_score: any) => Promise<void>;
  clearErrors: () => void;
  clearClient: () => void;
  // getAvailablePrograms: () => Promise<void>;
  getConfiguredQuestions: (is_accessToken: any) => Promise<void>;
  // getReferral: () => Promise<void>;
  logo: () => Promise<void>;
  Referral: Types.Referral[];
  isEdit: string;

}

export class DynamicNewClientContainer extends React.Component<
  DynamicNewClientContainerProp,
  DynamicNewClientContainerState
  > {
  constructor(props: DynamicNewClientContainerProp) {
    super(props);
    this.state = this.getInitialState();

  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: "",
      isSuccess: false
    };
  }

  GetQuestions = async () => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken

    try {
      await this.props.getConfiguredQuestions(is_accessToken);

    } catch (error) {
      console.log(error)
      const { history } = this.props;
      if (error.status === 403) {
        history.push(`/${domainPath}/logout/`)
      }
    }
  }

  async componentDidMount() {
    this.props.closeSnackbar();
    this.GetQuestions();
    // this.props.getAvailablePrograms();
    }
  saveClientStep1 = async (client: Types.DynamicClient) => {
    const { history } = this.props;
    const { index } = this.props.match.params;
    this.props.clearErrors();
    this.setState({ isLoading: true });
    //this.props.saveClient(client, true, true);
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    const is_role_type: any = this.props.user && this.props.user.user.role_type
    const is_prediction_available: any = this.props.user && this.props.user.user.is_prediction_available
    const res: any = await this.props.insertDClient(client, is_accessToken);
    this.setState({ isLoading: false, error: "" });
    if (res !== null && res.data.message === "client registered") {
      this.setState({ isSuccess: true })
      this.props.enqueueSnackbar(index ? "Client details updated Successfully." : "New Client Created Successfully.");
      {
        is_role_type === "Contributor" || client["Exclusionary Criteria Exists/Referral Rejected"] === "0" || !is_prediction_available ?
          history.push(`/${domainPath}/new-client/`) :
          history.push(`/${domainPath}/new-client/program-selection`)

      }
    }
    else {
      this.setState({
        error: res.data.response
      })
    }

  };

  getLocationsAndPcr = async (selected_program: string) => {

    const { client: clientState } = this.props;
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    if (!clientState || !clientState.client) {
      return false;
    }
    this.setState({ isLoading: true });
    await this.props.getPcr(clientState.client["Client Code"]!, selected_program);
    await this.props.getLocations(
      clientState.client["Client Code"]!,
      selected_program,
      is_accessToken
    );
    this.setState({ isLoading: false });
  };

  submitProgram = async (client: Types.Client) => {
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
    //this.props.clearClient();
  };

  saveProgramAndLocation = async (selected_location: string, pcr_score: any, roc_score: any) => {


    const { client: clientState } = this.props;
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    if (!clientState || !clientState.client) {
      this.props.enqueueSnackbar("Error. Client info not available.");
      return;
    }
    this.setState({ isLoading: true });
    await this.props.saveLocationAndProgram(selected_location,pcr_score,roc_score); 
    this.setState({ isLoading: false });

    this.props.enqueueSnackbar("Data saved successfully.");

  };


  saveClientStep2 = async (client: Types.Client) => {

    const { history } = this.props;
    const is_role_type: any = this.props.user && this.props.user.user.role_type
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    try {
      this.setState({ isLoading: true });
      this.props.saveClient(client);
      await this.props.insertDClient(client, is_accessToken);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("New Client Created Successfully.");
      {
        is_role_type === "Contributor" ?
          history.push(`/${domainPath}/new-client/`) :
          history.push(`/${domainPath}/new-client/program-selection`)
      }

    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("An error occurred." + error);
    }
  };

  render() {
    const { client: clientState, program: programState, referral: referralState, dynamicclient: questionsState } = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const clientList = (clientState && clientState.clientList) || {};
    const configuredQuestionsList: any = (questionsState && questionsState.configuredQuestionsList) || [];
    const { match: { params } } = this.props;
    const { index, Rerefer } = this.props.match.params;
    let currentClient: Types.Client;
    currentClient = clientState ? clientState.client : Types.emptyClient;
    const availableProgramList =
      (programState && programState.availableProgramList) || [];
      console.log(configuredQuestionsList)
    return (
      <Switch>
        <Route exact path={`/${domainPath}/new-client/program-selection`}>
          <ProgramSelection
            client={currentClient}
            {...this.state}
            onProgramSelect={this.getLocationsAndPcr}
            onLocationSelect={this.saveProgramAndLocation}
            submitPrediction={this.submitProgram}
            isLoading={this.state.isLoading}
            programList={availableProgramList}
          />
        </Route>
        <Route
          exact
          path={`/${domainPath}/new-client/2`}
          render={routeProps => {
            return (
              <PredictionFormStep2
                {...this.state}
                {...routeProps}
                client={currentClient}
                onFormSubmit={this.saveClientStep2}
                errors={(clientState && clientState.errors) || undefined}
              />
            );
          }}
        ></Route>
        <Route exact path={index ? `/${domainPath}/existing-client/edit-details/:index&:isEdit&:Rerefer` : `/${domainPath}/new-client`}>
          <PredictionFormStep
            {...this.state}
            isEdit={index ? "true" : "false"}
            reReffer={Rerefer ? Rerefer : ""}
            Referral={referralList}
            user={this.props && this.props.user}
            DynamicQuestions={index ? clientList[index].sections : configuredQuestionsList}
            // DynamicQuestions={index ? Object.keys(clientList[index]).map((key, id) => clientList[index][key] && clientList[index][key].hasOwnProperty("section") ? clientList[index][key] : "") : configuredQuestionsList}
            client={currentClient.model_program ? Types.emptyClient : currentClient}
            onFormSubmit={this.saveClientStep1}
            errors={this.state.error}
          />
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    client: state.client,
    program: state.program,
    referral: state.referral,
    user: state.user,
    dynamicclient: state.dynamicclient
  };
};

const mapDispatchToProps = {
  saveClient: client.actions.upsertClient,
  insertDClient: dynamicclient.actions.insertDClient,
  submitPrediction: dynamicclient.actions.submitPrediction,
  getLocations: dynamicclient.actions.getLocations,
  getPcr: dynamicclient.actions.getPcr,
  saveLocationAndProgram: dynamicclient.actions.saveLocationAndProgram,
  clearErrors: client.actions.clearErrors,
  clearClient: client.actions.clear,
  // getAvailablePrograms: program.actions.getAvailablePrograms,
  getConfiguredQuestions: dynamicclient.actions.getConfiguredQuestions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DynamicNewClientContainer));
