import React from "react";
import { connect } from "react-redux";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { wrap, mainContent } from "../components/styles";
import { AppState } from "../redux-modules/root";
import * as programLocation from "../redux-modules/location";
import * as referral from "../redux-modules/referral";
import * as analytics from "../redux-modules/analytics";
import { ContainerProps } from "./Container";
import * as Types from "../api/definitions";
import Dashboard from "../components/Dashboard"; 
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

export interface DashboardContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
 
}

export interface DashboardContainerProps
  extends ContainerProps<MatchParams>,
    WithSnackbarProps {
  getDateAnalytics: (analytics: Types.Analytics) => Promise<void>;
  getReferral: () => Promise<void>;
  getAnalytics: () => Promise<void>;
  getPCRAnalytics: () => Promise<void>;
  getROCAnalytics: () => Promise<void>;
  getReplacementAnalytics: () => Promise<void>;
  getOccupancyAnalytics: () => Promise<void>;
  getStayAnalytics: () => Promise<void>;
  getLocations: () => Promise<void>;
  Referral: Types.Referral[];
}

export class DashboardContainer extends React.Component<
DashboardContainerProps,
DashboardContainerState
> {
  constructor(props: DashboardContainerProps) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: false,
      error: "",
      
    };
  }

  async componentDidMount() {
    const { client: clientState } = this.props;
    const clientList = (clientState && clientState.clientList) || {};
    const { index } = this.props.match.params;
    this.setState({ isLoading: true });

    this.setState({ isLoading: false });
    this.props.getReferral();
    this.props.getAnalytics();
    this.props.getLocations(); 
    this.props.getPCRAnalytics();
    this.props.getROCAnalytics();
    this.props.getReplacementAnalytics(); 
    this.props.getOccupancyAnalytics();
    this.props.getStayAnalytics();
  }

   getDateAnalytics = async (analytics: Types.Analytics) => {
     console.log(analytics)
    await this.props.getDateAnalytics(analytics); 
  };

  getTotalAnalytics = async (filter: any) => {
    console.log(analytics)
   await this.props.getDateAnalytics(filter); 
 };

  render() {
    const {
      //  client: clientState,
            referral: referralState,
             analytics: analyticsState,
             programLocation: locationState,} = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const locationList = (locationState && locationState.locationList) || []; 
    const analyticsList = (analyticsState && analyticsState.analyticsList) || [];
    const pcrList = (analyticsState && analyticsState.PCRAnalyticsList) || [];
    const rocList = (analyticsState && analyticsState.ROCAnalyticsList) || [];
    const replaceList = (analyticsState && analyticsState.ReplacementList) || [];
    const stayList = (analyticsState && analyticsState.StayList) || [];
    const occupancyList = (analyticsState && analyticsState.OccupancyList) || [];
    // const clientList = (clientState && clientState.clientList) || {};
    return (
      <div css={wrap}>
        <div css={mainContent}>
        <Dashboard
           {...this.state}
              Referral={referralList}
              Analytics={analyticsList}
              PCR_analytics={pcrList}
              ROC_analytics={rocList}
              Replace_analytics={replaceList}
              Stay_analytics={stayList}
              Occupancy_analytics={occupancyList}
              Location={locationList} 
              onFormSubmit={this.getDateAnalytics} 
              totalAnalytics={this.getTotalAnalytics}
              
            />
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
    analytics: state.analytics,
    user: state.user,
    programLocation: state.programLocation
  };
};

const mapDispatchToProps = {
  getReferral: referral.actions.getReferral,
  getAnalytics: analytics.actions.getAnalytics,
  getDateAnalytics: analytics.actions.getDateAnalytics,
  getLocations: programLocation.actions.getLocations,
  getPCRAnalytics: analytics.actions.getPCRAnalytics,
  getROCAnalytics: analytics.actions.getROCAnalytics,
  getReplacementAnalytics: analytics.actions.getReplacementAnalytics,
  getStayAnalytics: analytics.actions.getStayAnalytics,
  getOccupancyAnalytics: analytics.actions.getOccupancyAnalytics,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DashboardContainer));
