import React from "react";
import { connect } from "react-redux";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { AppState } from "../redux-modules/root";
import * as program from "../redux-modules/program";
import * as referral from "../redux-modules/referral";
import { ContainerProps } from "./Container";
import * as dynamicclient from "../redux-modules/dynamicclient";
import ClientSearch from "../components/ClientSearch";
import Logout from "../components/Logout"
import DynamicClientDetailsContainer from "./DynamicClientDetailsContainer";
import EditClientContainer from "./EditClientContainer" ;
import DynamicNewClientContainer from "./DynamicNewClientContainer" ;
//import ReferralList from "../components/ReferralList";
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

export interface DynamicExistingClientContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
  program_completion_response: string | null;
  is_Searched: boolean;
}

export interface DynamicExistingClientContainerProp
  extends ContainerProps,
    WithSnackbarProps {
  searchDClient: (client_code: string, client_name: string, is_accessToken: any) => void;
  getAvailablePrograms: () => Promise<void>;
  getReferral: () => Promise<void>;
}

export class DynamicExistingClientContainer extends React.Component<
DynamicExistingClientContainerProp,
DynamicExistingClientContainerState
> {
  constructor(props: DynamicExistingClientContainerProp) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: "",
      program_completion_response: null,
      is_Searched: false
    };
  }

  componentDidMount() {
    this.props.closeSnackbar();
    this.props.getAvailablePrograms();
    this.props.getReferral();
  }

  searchDClient = async (client_code: string, client_name: string) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    try {
      await this.props.searchDClient(client_code, client_name,is_accessToken);
    this.setState({
      is_Searched: true
    })
    } catch (error) {
      console.log(error)
      const { history } = this.props;
      if (error.status === 403) {
        history.push(`/${domainPath}/logout/`)
      } 
    }
    
  };

  render() {
    const { client: clientState, program: programState, referral: referralState } = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const clientList = (clientState && clientState.clientList) || {};
  const {is_Searched}= this.state
  return (
      <Switch>
        <Route exact path={`/${domainPath}/existing-client`}>
          <ClientSearch
            clientList={is_Searched ? Object.values(clientList):[]}
            {...this.state}
            onFormSubmit={this.searchDClient}
          />
        </Route>
        <Route
          exact
          path={`/${domainPath}/existing-client/client-details/:index`} 
          component={DynamicClientDetailsContainer}
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
          path={`/${domainPath}/existing-client/edit-details/:index&:isEdit`}
          component={DynamicNewClientContainer}
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
  searchDClient: dynamicclient.actions.searchDClient,
  getAvailablePrograms: program.actions.getAvailablePrograms,
  getReferral: referral.actions.getReferral
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DynamicExistingClientContainer));
