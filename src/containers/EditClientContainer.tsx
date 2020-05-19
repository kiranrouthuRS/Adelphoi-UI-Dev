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
import * as Types from "../api/definitions";
import PredictionFormStep1 from "../components/PredictionFormStep1";
import PredictionFormStep2 from "../components/PredictionFormStep2";
import ProgramSelection from "../components/ProgramSelection";
import { Switch, Route } from "react-router-dom";
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

export interface EditClientContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
  program_completion_response: string | null;
}

export interface EditClientContainerProps
  extends ContainerProps<MatchParams>,
    WithSnackbarProps {
saveClient: (
client: Types.Client,
page1FormCompleted?: boolean,
excludePage2?: boolean
) => void;
updateClient: (
    client: Types.Client,) => Promise<void>;
  searchClient: (client_code: string, client_name: string) => Promise<void>;
  updateProgramCompletion: (
    client_code: string,
    program_completion: number | null,
    returned_to_care: number | null,
    program_significantly_modified: number,
    program: string | null,
    location: string | null
  ) => Promise<string>;
  getAvailablePrograms: () => Promise<void>;
  submitPrediction: (client: Types.Client) => Promise<void>;
  getLocations: (
    client_code: string,
    selected_program: string
  ) => Promise<void>;
  getPcr: (client_code: string, selected_program: string) => Promise<void>;
  saveLocationAndProgram: (selected_location: string) => Promise<void>;
  clearErrors: () => void;
  clearClient: () => void;
  getProgramsForClient: (client_code: string) => Promise<void>;
  updateFormValues: (client_code: string, values: any) => void;
  getReferral: () => Promise<void>;
  Referral: Types.Referral[];
}

export class EditClientContainer extends React.Component<
  EditClientContainerProps,
  EditClientContainerState
> {
  constructor(props: EditClientContainerProps) {
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
    const { client: clientState } = this.props;
    const clientList = (clientState && clientState.clientList) || {};
    const { index } = this.props.match.params;
    this.setState({ isLoading: true });

    if (!clientList[index]) {
      await this.searchClient(index, "");
    }
    // fetch program for this client
    await this.props.getProgramsForClient(index);
    this.setState({ isLoading: false });
    this.props.closeSnackbar();
    this.props.getAvailablePrograms();
    this.props.getReferral();
  }

  searchClient = async (client_code: string, client_name: string) => {
    await this.props.searchClient(client_code, client_name);
  };

  saveClientStep1 = async (client: Types.Client) => {
    const { history } = this.props;
    this.props.clearErrors();
    
    // check excl criteria
    if (client.Exclusionary_Criteria) {
      
      try {
        this.setState({ isLoading: true });
        this.props.saveClient(client, true, true);
        await this.props.updateClient(client);
        this.setState({ isLoading: false });
        this.props.enqueueSnackbar(`Thanks for registering with ${domainPath}`);
        this.props.clearErrors();
        this.props.clearClient();
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false });
      }
    } else {
        const { index } = this.props.match.params;
      this.setState({ isLoading: true });
      this.props.saveClient(client, true, false);
      history.push(`/${domainPath}/existing-client/edit-details/${index}/2`);
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
    const { index } = this.props.match.params;
    const { history } = this.props;
    const is_role_type: any = this.props.user && this.props.user.user.role_type 
    try {
      this.setState({ isLoading: true });
      this.props.saveClient(client);
      await this.props.updateClient(client);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("Client Updated Successfully.");
      {is_role_type === "Contributor" ?
        history.push(`/${domainPath}/new-client/`) :
        history.push(`/${domainPath}/existing-client/edit-details/${index}/program-selection`)
      }
      //this.props.clearClient();
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
      this.props.enqueueSnackbar("An error occurred." + error);
    }
  };

  render() {
    const { client: clientState,
            referral: referralState,program: programState,} = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const clientList = (clientState && clientState.clientList) || {};
    let currentClient: Types.Client;
    currentClient = clientState ? clientState.client : Types.emptyClient;
    const availableProgramList =
    (programState && programState.availableProgramList) || [];
    const { index } = this.props.match.params;
    return (  
        <Switch>
        <Route exact path={`/${domainPath}/existing-client/edit-details/:index/program-selection`}>
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
          path={`/${domainPath}/existing-client/edit-details/:index/2`}
          
        >
            <PredictionFormStep2
                {...this.state}
               // {...routeProps}
               client={currentClient}
                onFormSubmit={this.saveClientStep2}
                errors={(clientState && clientState.errors) || undefined}
              />
        </Route>
        <Route exact path={`/${domainPath}/existing-client/edit-details/:index,:isEdit`}>
          <PredictionFormStep1
            {...this.state}
            isEdit="true"
            Referral={referralList}
            client= {clientList[index]}
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
  updateClient: client.actions.updateClient,
  getReferral: referral.actions.getReferral,
  searchClient: client.actions.searchClient,
  updateProgramCompletion: client.actions.updateProgramCompletion,
  getAvailablePrograms: program.actions.getAvailablePrograms,
  submitPrediction: client.actions.submitPrediction,
  getLocations: client.actions.getLocations,
  getPcr: client.actions.getPcr,
  saveLocationAndProgram: client.actions.saveLocationAndProgram,
  clearErrors: client.actions.clearErrors,
  clearClient: client.actions.clear,
  getProgramsForClient: client.actions.getProgramsForClient,
  updateFormValues: client.actions.updateFormValues
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(EditClientContainer));
