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
import Dashboard from "../components/Dashboard/Dashboard";
import { domainPath } from "../App"
interface MatchParams {
  index: string;
}

export interface DashboardContainerState {
  isLoading: boolean;
  error: string;
  hasError: boolean;
  filters: any;

}

export interface DashboardContainerProps
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
  getDateAnalytics: (analytics: any) => Promise<void>;
  getDReferral: () => Promise<void>;
  getAnalytics: () => Promise<void>;
  getPCRAnalytics: (analytics: any) => Promise<void>;
  getROCAnalytics: (analytics: any) => Promise<void>;
  getReplacementAnalytics: (analytics: any) => Promise<void>;
  getOccupancyAnalytics: (analytics: any) => Promise<void>;
  getAllocationAnalytics: (analytics: any) => Promise<void>;
  getProgram_AllocationAnalytics: (analytics: any) => Promise<void>;
  getPerformance_Analytics: (analytics: any) => Promise<void>;
  getStayAnalytics: (analytics: any) => Promise<void>;
  get_Tool_Analytics: (analytics: any) => Promise<void>;
  getGender_Analytics: (analytics: any) => Promise<void>;
  GetAge_Analytics: (analytics: any) => Promise<void>;
  get_Demo_Analytics: (analytics: any) => Promise<void>;
  get_Calibration_Analytics: (analytics: any) => Promise<void>;
  getMarket_Analytics: (analytics: any) => Promise<void>;
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
      filters: {
        days_count: "30",
      }
    };
  }

  async componentDidMount() {
    const { client: clientState } = this.props;
    const clientList = (clientState && clientState.clientList) || {};
    const { index } = this.props.match.params;
    this.setState({ isLoading: true });

    this.setState({ isLoading: false });
    await this.props.getDReferral();
    await this.props.getDateAnalytics(this.state.filters);
    await this.props.getLocations();
    await this.props.getPCRAnalytics(this.state.filters);
    await this.props.getROCAnalytics(this.state.filters);
    await this.props.getReplacementAnalytics(this.state.filters);
    await this.props.getOccupancyAnalytics(this.state.filters);
    await this.props.getAllocationAnalytics(this.state.filters);
    await this.props.getProgram_AllocationAnalytics(this.state.filters)
    await this.props.getStayAnalytics(this.state.filters);
    await this.props.getMarket_Analytics(this.state.filters);
    await this.props.get_Tool_Analytics(this.state.filters);
    await this.props.get_Calibration_Analytics(this.state.filters);
    await this.props.getGender_Analytics(this.state.filters);
    await this.props.GetAge_Analytics(this.state.filters);
    const demo = { q: "lang", days_count: '30' };
    await this.props.get_Demo_Analytics(demo) 
    const data = { referral_source: "0", days_count: '30' };
    await this.props.getPerformance_Analytics(data);
  }

  getDateAnalytics = async (analytics: any) => {
    await this.props.getDateAnalytics(analytics);
    await this.props.getPCRAnalytics(analytics);
    await this.props.getROCAnalytics(analytics);
    await this.props.getReplacementAnalytics(analytics);
    await this.props.getOccupancyAnalytics(analytics);
    await this.props.getStayAnalytics(analytics);
    await this.props.getAllocationAnalytics(analytics);
    await this.props.getProgram_AllocationAnalytics(analytics);
    await this.props.getMarket_Analytics(analytics);
    await this.props.get_Tool_Analytics(analytics);
    await this.props.get_Calibration_Analytics(analytics);
    await this.props.getGender_Analytics(analytics);
    await this.props.GetAge_Analytics(analytics);
    const demo = {
      q: "lang",
      start_date: analytics.start_date,
      end_date: analytics.end_date,
      days_count: analytics.days_count,
    };
    await this.props.get_Demo_Analytics(demo);
    let data = {
      start_date: analytics.start_date,
      end_date: analytics.end_date,
      days_count: analytics.days_count,
      referral_source: "0"
    }
    console.log(analytics)
    await this.props.getPerformance_Analytics(data)
  };

  getTotalAnalytics = async (filter: any) => {
    await this.props.getDateAnalytics(filter);
  };

  getProgramAnalytics = async (filter: any) => {
    console.log(filter)

    await this.props.getPCRAnalytics(filter);
    await this.props.getROCAnalytics(filter);
  };
  getOtherAnalytics = async (filter: any) => {
    await this.props.getReplacementAnalytics(filter);
    await this.props.getOccupancyAnalytics(filter);
    await this.props.getStayAnalytics(filter);
  };
  getPerformance = async (filter: any) => {
    console.log(filter)
    await this.props.getPerformance_Analytics(filter)
  };
  getDemo = async (filter: any) => {
    console.log(filter)
    await this.props.get_Demo_Analytics(filter)
  };
  getCalibration = async (filter: any) => {
    console.log(filter)
    await this.props.get_Calibration_Analytics(filter)
  };
  render() {
    const {
      //  client: clientState,
      referral: referralState,
      analytics: analyticsState,
      programLocation: locationState, } = this.props;
    const referralList = (referralState && referralState.referralList) || [];
    const locationList = (locationState && locationState.locationList) || [];
    const analyticsList = (analyticsState && analyticsState.analyticsList) || [];
    const pcrList = (analyticsState && analyticsState.PCRAnalyticsList) || [];
    const rocList = (analyticsState && analyticsState.ROCAnalyticsList) || [];
    const replaceList = (analyticsState && analyticsState.ReplacementList) || [];
    const stayList = (analyticsState && analyticsState.StayList) || [];
    const occupancyList = (analyticsState && analyticsState.OccupancyList) || [];
    const allocationList = (analyticsState && analyticsState.AllocationList) || [];
    const Program_Alloc_List = (analyticsState && analyticsState.Program_Alloc_List) || [];
    const market_analytics_List = (analyticsState && analyticsState.Market_Analytics_List) || [];
    const performance_analytics_List = (analyticsState && analyticsState.Performance_Analytics_List) || [];
    const gender_analytics_List = (analyticsState && analyticsState.Gender_List) || [];
    const age_analytics_List = (analyticsState && analyticsState.Age_List) || [];
    const tool_analytics_List = (analyticsState && analyticsState.Tool_List) || [];
    const Cali_analytics_List = (analyticsState && analyticsState.Calibration_List) || [];
    const demo_analytics_List = (analyticsState && analyticsState.Demo_List) || [];
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
            Program_Alloc_List={Program_Alloc_List}
            Allocation_List={allocationList}
            Market_List={market_analytics_List}
            PerformanceList={performance_analytics_List}
            CalibrationList={Cali_analytics_List}
            Location={locationList}
            onFormSubmit={this.getDateAnalytics}
            totalAnalytics={this.getTotalAnalytics}
            Program_Analytics={this.getProgramAnalytics}
            Other_Analytics={this.getOtherAnalytics}
            Performance_Analytics={this.getPerformance}
            Demo_Analytics={this.getDemo}
            Calibration_Analytics={this.getCalibration}
            Tool_List={tool_analytics_List}
            Gender_List={gender_analytics_List}
            Age_List={age_analytics_List}
            Demo_List={demo_analytics_List}
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
  getDReferral: referral.actions.getDReferral,
  getAnalytics: analytics.actions.getAnalytics,
  getDateAnalytics: analytics.actions.getDateAnalytics,
  getLocations: programLocation.actions.getLocations,
  getPCRAnalytics: analytics.actions.getPCRAnalytics,
  getROCAnalytics: analytics.actions.getROCAnalytics,
  getReplacementAnalytics: analytics.actions.getReplacementAnalytics,
  getStayAnalytics: analytics.actions.getStayAnalytics,
  getOccupancyAnalytics: analytics.actions.getOccupancyAnalytics,
  getAllocationAnalytics: analytics.actions.getAllocationAnalytics,
  getProgram_AllocationAnalytics: analytics.actions.getProgram_AllocationAnalytics,
  getMarket_Analytics: analytics.actions.getMarket_Analytics,
  getPerformance_Analytics: analytics.actions.getPerformance_Analytics,
  getGender_Analytics: analytics.actions.getGender_Analytics,
  GetAge_Analytics: analytics.actions.GetAge_Analytics,
  get_Tool_Analytics: analytics.actions.get_Tool_Analytics,
  get_Demo_Analytics: analytics.actions.get_Demo_Analytics,
  get_Calibration_Analytics: analytics.actions.get_Calibration_Analytics
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DashboardContainer));
