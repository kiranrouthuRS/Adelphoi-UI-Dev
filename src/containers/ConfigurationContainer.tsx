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
import * as programLocation from "../redux-modules/location";
import ProgramList from "../components/ProgramList";
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

  componentDidMount() {
    this.props.closeSnackbar();
    this.props.getReferral();
    this.props.getPrograms();
    this.props.getLocations();
  }

  render() {
    const {
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
    const referralList = (referralState && referralState.referralList) || [];
    const programList = (programState && programState.programList) || [];
    const locationList = (locationState && locationState.locationList) || [];
    const { match, location } = this.props;
    return (
      <Switch>
        <Route path={`/${domainPath}/configuration`}>
          <React.Fragment>
            <Paper style={{ flexGrow: 1, marginTop: 30 }}>
              <Tabs value={location.pathname} centered>
                <Tab
                  label="Referral Sources"
                  component={Link}
                  to={`${match.url}/referral`}
                  value={`${match.url}/referral`}
                />
                <Tab
                  label="Programs"
                  component={Link}
                  to={`${match.url}/programs`}
                  value={`${match.url}/programs`}
                />
                <Tab
                  label="Locations"
                  component={Link}
                  to={`${match.url}/locations`}
                  value={`${match.url}/locations`}
                />
                <Tab
                  label="Configuration"
                  component={Link}
                  to={`${match.url}/linking`}
                  value={`${match.url}/linking`}
                />
              </Tabs>
            </Paper>
            <Switch>
              <Route path={`${match.url}/referral`}>
                <ReferralList
                  referralList={referralList}
                  {...this.state}
                  createReferral={createReferral}
                  updateReferral={updateReferral}
                  deleteReferral={deleteReferral}
                />
              </Route>
              <Route path={`${match.url}/programs`}>
                <ProgramList
                  programList={programList}
                  {...this.state}
                  createProgram={createProgram}
                  updateProgram={updateProgram}
                  deleteProgram={deleteProgram}
                />
              </Route>
              <Route path={`${match.url}/locations`}>
                <LocationList
                  locationList={locationList}
                  {...this.state}
                  createLocation={createLocation}
                  updateLocation={updateLocation}
                  deleteLocation={deleteLocation}
                />
              </Route>
              <Route path={`${match.url}/linking`}>
                <ConfigurationForm
                  referral={referralList}
                  locations={locationList}
                  programs={programList}
                  {...this.state}
                  onFormSubmit={this.saveConfiguration}
                />
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
    program: state.program,
    programLocation: state.programLocation
  };
};

const mapDispatchToProps = {
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
