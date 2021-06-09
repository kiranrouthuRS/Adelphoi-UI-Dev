/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { connect } from "react-redux";
import { withSnackbar, WithSnackbarProps } from "notistack";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link } from "react-router-dom";
import { AppState } from "../redux-modules/root";
import { ContainerProps } from "./Container";
import * as Types from "../api/definitions";
import * as program from "../redux-modules/program";
import * as referral from "../redux-modules/referral";
import * as users from "../redux-modules/users";
import * as programLocation from "../redux-modules/location";
import ProgramList from "../components/ProgramList";
import UsersList from "../components/UsersList";
import ReferralList from "../components/ReferralList";
import LocationList from "../components/LocationList";
import ConfigurationForm from "../components/ConfigurationForm";
import { updateConfiguration } from "../api/api";
import { domainPath } from "../App"
export interface ConfigurationContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
}

export interface ConfigurationContainerProp
  extends ContainerProps,
  WithSnackbarProps {
  getUsers: () => Promise<void>;
  createUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  updateUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  deleteUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  getRoles:(is_accessToken:any) => Promise<void>;
  getAvailableUsers: (users: Types.Users) => Promise<void>;
  getReferral: () => Promise<void>;
  createReferral: (referral: Types.Referral) => Promise<void>;
  updateReferral: (referral: Types.Referral) => Promise<void>;
  deleteReferral: (referral: Types.Referral) => Promise<void>;
  getPrograms: () => Promise<void>;
  createProgram: (program: Types.Program) => Promise<void>;
  updateProgram: (program: Types.Program) => Promise<void>;
  deleteProgram: (program: Types.Program) => Promise<void>;
  getLocations: () => Promise<void>;
  createLocation: (program: Types.Location) => Promise<void>;
  updateLocation: (program: Types.Location) => Promise<void>;
  deleteLocation: (program: Types.Location) => Promise<void>;
}

export class ConfigurationContainer extends React.Component<
  ConfigurationContainerProp,
  ConfigurationContainerState
  > {
  constructor(props: ConfigurationContainerProp) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: "",
      config_update_response: null
    };
  }

  saveConfiguration = async (config: Types.Configuration) => {
    try {
      await updateConfiguration(config);
      this.props.enqueueSnackbar("Configuration Data saved successfully.");
    } catch (error) {
      this.props.enqueueSnackbar(
        "An error occurred while saving configuration"
      );
    }
  };

  async componentDidMount() {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    this.props.closeSnackbar();
    
    try {
      await this.props.getRoles(is_accessToken);
    } catch (error) {
      console.log(error)
      const { history } = this.props;
      if (error.status === 403) {
        history.push(`/${domainPath}/logout/`)
      } 
    }
    await this.props.getUsers();
    // await  this.props.getReferral();
    // await this.props.getPrograms();
    // await this.props.getLocations();   
    
  }

  render() {
    const {
      users: usersState,
      createUsers,
      updateUsers,
      deleteUsers,
      getAvailableUsers,
      getRoles,
      referral: referralState, 
      createReferral,
      updateReferral,
      deleteReferral,
      program: programState,
      createProgram,
      updateProgram,
      deleteProgram,
      programLocation: locationState,
      createLocation,
      updateLocation,
      deleteLocation
    } = this.props;
    
    const  rolesList = (usersState && usersState.rolesList) || [];
    const  availableUsersList = (usersState && usersState.availableUsersList) || [];
    const usersList = (usersState && usersState.usersList) || [];
    const referralList = (referralState && referralState.referralList) || [];
    const programList = (programState && programState.programList) || [];
    const locationList = (locationState && locationState.locationList) || [];
    const { match, location,user } = this.props;
    const role_type:any = user && user.user && user.user.role_type
    return (
      <Switch>
        <Route path={`/${domainPath}/configuration`}>
          <React.Fragment>
            <Paper style={{ flexGrow: 1, marginTop: 30 }}>  
              <Tabs value={location.pathname} centered>
                {role_type === "Consultant" || role_type === "Contributor" ? "":
                <Tab
                  label="Users"
                  component={Link}
                  to={`${match.url}/users`}
                  value={`${match.url}/users`}
                />
                }
                {role_type === "Consultant"  || role_type === "Contributor" ? "":
                domainPath !== "adelphoiDDD" ?"":
                <Tab
                  label="Referral Sources"
                  component={Link}
                  to={`${match.url}/referral`}
                  value={`${match.url}/referral`} 
                />}
                {domainPath !== "adelphoiDDD" ?"":
                <Tab
                  label="Programs"
                  component={Link}
                  to={`${match.url}/programs`}
                  value={`${match.url}/programs`}
                />}
                {domainPath !== "adelphoiDDD" ?"":
                <Tab
                  label="Locations"
                  component={Link}
                  to={`${match.url}/locations`}
                  value={`${match.url}/locations`}
                />}
                {domainPath !== "adelphoiDDD" ?"":
                <Tab
                  label="Configuration"   
                  component={Link}
                  to={`${match.url}/linking`}
                  value={`${match.url}/linking`}
                />} 
              </Tabs>
            </Paper>
            <Switch>
              <Route path={`${match.url}/users`}>
              {role_type === "Consultant"  || role_type === "Contributor" ? "":
                <UsersList
                  usersList={usersList}
                  availableUsersList={availableUsersList}
                  rolesList={rolesList}
                  {...this.state}
                  createUsers={createUsers}
                  updateUsers={updateUsers}
                  deleteUsers={deleteUsers} 
                  getAvailableUsers={getAvailableUsers}
                  getRoles={getRoles}
                  
                />}
              </Route>
              <Route path={`${match.url}/referral`}>
              {role_type === "Consultant"  || role_type === "Contributor" ? "":
                domainPath !== "adelphoiDDD" ?"":
                <ReferralList
                  referralList={referralList}
                  {...this.state}
                  createReferral={createReferral}
                  updateReferral={updateReferral}
                  deleteReferral={deleteReferral}
                />}
              </Route>
              <Route path={`${match.url}/programs`}>
              {domainPath !== "adelphoiDDD" ?"":
                <ProgramList
                  programList={programList}
                  {...this.state}
                  createProgram={createProgram}
                  updateProgram={updateProgram}
                  deleteProgram={deleteProgram}
                />}
              </Route>
              <Route path={`${match.url}/locations`}>
              {domainPath !== "adelphoiDDD" ?"":
                <LocationList
                  locationList={locationList}
                  {...this.state}
                  createLocation={createLocation}
                  updateLocation={updateLocation}
                  deleteLocation={deleteLocation}
                />}
              </Route>
              <Route path={`${match.url}/linking`}>
              {domainPath !== "adelphoiDDD" ?"":
                <ConfigurationForm
                  referral={referralList}
                  locations={locationList}
                  programs={programList}
                  {...this.state}
                  onFormSubmit={this.saveConfiguration}
                />}
              </Route>
              <Route path={`${match.url}`}>
                <div>Programs default page</div>
              </Route>
            </Switch>
          </React.Fragment>
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    referral: state.referral,
    users: state.users,
    user: state.user,
    program: state.program,
    programLocation: state.programLocation
  };
};

const mapDispatchToProps = {
  getUsers: users.actions.getUsers,
  createUsers: users.actions.createUsers,
  updateUsers: users.actions.updateUsers,
  deleteUsers: users.actions.deleteUsers,
  getAvailableUsers: users.actions.getAvailableUsers,
  getRoles:users.actions.getRoles,
  getReferral: referral.actions.getReferral,
  createReferral: referral.actions.createReferral,
  updateReferral: referral.actions.updateReferral,
  deleteReferral: referral.actions.deleteReferral,
  getPrograms: program.actions.getPrograms,
  createProgram: program.actions.createProgram,
  updateProgram: program.actions.updateProgram,
  deleteProgram: program.actions.deleteProgram,
  getLocations: programLocation.actions.getLocations,
  createLocation: programLocation.actions.createLocation,
  updateLocation: programLocation.actions.updateLocation,
  deleteLocation: programLocation.actions.deleteLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(ConfigurationContainer));
