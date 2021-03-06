import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as Types from "../api/definitions";
import { AppState } from "../redux-modules/root";
import { ContainerProps } from "./Container";
import * as client from "../redux-modules/client";
import * as program from "../redux-modules/program";
import * as referral from "../redux-modules/referral";
import ReferralList from "../components/ReferralList";
import PredictionFormStep1 from "../components/PredictionFormStep1";
import PredictionFormStep2 from "../components/PredictionFormStep2";
import ProgramSelection from "../components/ProgramSelection";
import { domainPath } from "../App"

export interface NewClientContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
}

export interface NewClientContainerProp
  extends ContainerProps,
    WithSnackbarProps {
  saveClient: (
    client: Types.Client,
    page1FormCompleted?: boolean,
    excludePage2?: boolean
  ) => void;
  insertClient: (client: Types.Client) => Promise<void>;
  submitPrediction: (client: Types.Client) => Promise<void>;
  getLocations: (
    client_code: string,
    selected_program: string
  ) => Promise<void>;
  getPcr: (client_code: string, selected_program: string) => Promise<void>;
  saveLocationAndProgram: (selected_location: string) => Promise<void>;
  clearErrors: () => void;
  clearClient: () => void;
  getAvailablePrograms: () => Promise<void>;
  getReferral: () => Promise<void>;
  Referral: Types.Referral[];
  isEdit: string;
}

export class NewClientContainer extends React.Component<
  NewClientContainerProp,
  NewClientContainerState
> {
  constructor(props: NewClientContainerProp) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: ""
    };
  }

  componentDidMount() {
    this.props.closeSnackbar();
    this.props.getAvailablePrograms();
    this.props.getReferral();
    
  }

  saveClientStep1 = async (client: Types.Client) => {
    const { history } = this.props;
    this.props.clearErrors();
    
    // check excl criteria
    if (client.Exclusionary_Criteria) {
      
      try {
        this.setState({ isLoading: true });
        this.props.saveClient(client, true, true);
        await this.props.insertClient(client);
        this.setState({ isLoading: false });
        this.props.enqueueSnackbar(`Thanks for registering with ${domainPath}`);
        this.props.clearErrors();
        this.props.clearClient();
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false });
      }
    } else {
      this.setState({ isLoading: true });
      this.props.saveClient(client, true, false);
      history.push(`/${domainPath}/new-client/2`);
      this.setState({ isLoading: false });
    }
  };

  getLocationsAndPcr = async (selected_program: string) => {
   
    const { client: clientState } = this.props;
    if (!clientState || !clientState.client) {
      return false;
    }
    this.setState({ isLoading: true });
    await this.props.getPcr(clientState.client.client_code!, selected_program);
    await this.props.getLocations(
      clientState.client.client_code!,
      selected_program
    );
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
    //this.props.clearClient();
  };

  saveProgramAndLocation = async (selected_location: string) => {
    
    // const { history } = this.props;
    const { client: clientState } = this.props;
    if (!clientState || !clientState.client) {
      this.props.enqueueSnackbar("Error. Client info not available.");
      return;
    }
    this.setState({ isLoading: true });
    await this.props.saveLocationAndProgram(selected_location);
    this.setState({ isLoading: false });
    
    this.props.enqueueSnackbar("Data saved successfully.");
    //this.props.clearClient();
  };
  

  saveClientStep2 = async (client: Types.Client) => {
    
    const { history } = this.props;
    const is_role_type: any = this.props.user && this.props.user.user.role_type 
    try {
      this.setState({ isLoading: true });
      this.props.saveClient(client);
      await this.props.insertClient(client);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("New Client Created Successfully.");
      {is_role_type === "Contributor" ?
        history.push(`/${domainPath}/new-client/`) :
        history.push(`/${domainPath}/new-client/program-selection`)
      }
      //this.props.clearClient();
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("An error occurred." + error);
    }
  };

  render() {
    const { client: clientState, program: programState, referral: referralState, } = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const { match: { params } } = this.props;
    let currentClient: Types.Client;
    currentClient = clientState ? clientState.client : Types.emptyClient;
    const availableProgramList =
      (programState && programState.availableProgramList) || [];
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
            // const step1 = clientState
            //   ? clientState.page1FormCompleted
            //   : this.state.isLoading;
            // if (!step1) {
            //   return (
            //     <h1>
            //       Error. First step of the new client form is incomplete.
            //       <Link to="/new-client">Click here to begin.</Link>
            //     </h1>
            //   );
            // }
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
        <Route exact path={`/${domainPath}/new-client`}>
          <PredictionFormStep1
            {...this.state}
            isEdit=""
            Referral={referralList}
            client={currentClient.model_program ? Types.emptyClient : currentClient}
            onFormSubmit={this.saveClientStep1}
            errors = {(clientState && clientState.errors) || undefined}
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
    user: state.user
  };
};

const mapDispatchToProps = {
  saveClient: client.actions.upsertClient,
  insertClient: client.actions.insertClient,
  submitPrediction: client.actions.submitPrediction,
  getLocations: client.actions.getLocations,
  getPcr: client.actions.getPcr,
  saveLocationAndProgram: client.actions.saveLocationAndProgram,
  clearErrors: client.actions.clearErrors,
  clearClient: client.actions.clear,
  getAvailablePrograms: program.actions.getAvailablePrograms,
  getReferral: referral.actions.getReferral,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(NewClientContainer));
