import React from "react";
import { connect } from "react-redux";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { AppState } from "../redux-modules/root";
import * as program from "../redux-modules/program";
import * as referral from "../redux-modules/referral";
import { ContainerProps } from "./Container";
import * as client from "../redux-modules/client";
import ClientSearch from "../components/ClientSearch";
import ClientDetailsContainer from "./ClientDetailsContainer";
import EditClientContainer from "./EditClientContainer" ;
//import ReferralList from "../components/ReferralList";
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

export interface ExistingClientContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
  program_completion_response: string | null;
}

export interface ExistingClientContainerProp
  extends ContainerProps,
    WithSnackbarProps {
  searchClient: (client_code: string, client_name: string) => void;
  // getAvailablePrograms: () => Promise<void>;
  getReferral: () => Promise<void>;
}

export class ExistingClientContainer extends React.Component<
  ExistingClientContainerProp,
  ExistingClientContainerState
> {
  constructor(props: ExistingClientContainerProp) {
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

  componentDidMount() {
    this.props.closeSnackbar();
    // this.props.getAvailablePrograms();
    this.props.getReferral();
  }

  searchClient = async (client_code: string, client_name: string) => {
    await this.props.searchClient(client_code, client_name);
  };

  render() {
    const { client: clientState, program: programState, referral: referralState } = this.props;
     
     const referralList = (referralState && referralState.referralList) || [];
    const clientList = (clientState && clientState.clientList) || {};
    // const availableProgramList =
    // (programState && programState.availableProgramList) || [];
    
    return (
      <Switch>
        <Route exact path={`/${domainPath}/existing-client`}>
          <ClientSearch
            clientList={Object.values(clientList)}
            {...this.state}
            onFormSubmit={this.searchClient}
          />
        </Route>
        <Route
          exact
          path={`/${domainPath}/existing-client/client-details/:index`} 
          component={ClientDetailsContainer}
        ></Route>
        <Route
          exact
          path={`/${domainPath}/existing-client/edit-details/:index/2`}
          component={EditClientContainer}
        ></Route>
        <Route
          exact
          path={`/${domainPath}/existing-client/edit-details/:index/program-selection`}
          component={EditClientContainer}
        ></Route>
        <Route
          exact
          path={`/${domainPath}/existing-client/edit-details/:index,:isEdit`}
          component={EditClientContainer}
        ></Route>
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
  searchClient: client.actions.searchClient,
  // getAvailablePrograms: program.actions.getAvailablePrograms,
  getReferral: referral.actions.getReferral
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(ExistingClientContainer));
