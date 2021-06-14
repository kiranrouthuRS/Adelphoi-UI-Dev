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
  accessToken: any;
}

export interface DashboardContainerProps
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
  getDateAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getDReferral: (accessToken:any) => Promise<void>;
  getAnalytics: (accessToken: any) => Promise<void>;
  getPCRAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getROCAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getReplacementAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getOccupancyAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getAllocationAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getProgram_AllocationAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  getPerformance_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  getStayAnalytics: (analytics: any,accessToken: any) => Promise<void>;
  get_ROC_Calibration_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  getGender_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  GetAge_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  get_Demo_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  get_PCR_Calibration_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  getMarket_Analytics: (analytics: any,accessToken: any) => Promise<void>;
  getLocations: (accessToken: any) => Promise<void>;
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
      accessToken: "",
      error: "",
      filters: {
        days_count: "30",
      }
    };
  }

  async componentDidMount() {
    const { client: clientState } = this.props;
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    this.setState({ isLoading: true });

    this.setState({ isLoading: false,accessToken: is_accessToken });
    try {
      await this.props.getDReferral(is_accessToken);
    } catch (error) {
      console.log(error)
      const { history } = this.props;
      if (error.status === 403) {
        history.push(`/${domainPath}/logout/`)
      } 
    }
   // this.props.getDateAnalytics(this.state.filters,is_accessToken);
      this.props.getLocations(is_accessToken);
    //  this.props.getPCRAnalytics(this.state.filters,is_accessToken);
    //  this.props.getROCAnalytics(this.state.filters,is_accessToken);
    //  this.props.getReplacementAnalytics(this.state.filters,is_accessToken);
    //  this.props.getOccupancyAnalytics(this.state.filters,is_accessToken);
      this.props.getAllocationAnalytics(this.state.filters,is_accessToken);
      this.props.getProgram_AllocationAnalytics(this.state.filters,is_accessToken)
    //  this.props.getStayAnalytics(this.state.filters,is_accessToken);
      this.props.getMarket_Analytics(this.state.filters,is_accessToken);
     this.props.get_ROC_Calibration_Analytics(this.state.filters,is_accessToken);
     this.props.get_PCR_Calibration_Analytics(this.state.filters,is_accessToken);
      this.props.getGender_Analytics(this.state.filters,is_accessToken);
      this.props.GetAge_Analytics(this.state.filters,is_accessToken);
    //  const demo = { q: "lang", days_count: '30' };
    //   this.props.get_Demo_Analytics(demo,is_accessToken) 
    // const data = { referral_source: "0", days_count: '30' };
     //this.props.getPerformance_Analytics(data,is_accessToken);
     this.setState({ isLoading: false });
  }

  getDateAnalytics = async (analytics: any) => {
    const is_accessToken: any = this.state.accessToken
    this.setState({ isLoading: true });
    await this.props.getDateAnalytics(analytics,is_accessToken);
    await this.props.getPCRAnalytics(analytics,is_accessToken);
    await this.props.getROCAnalytics(analytics,is_accessToken);
    await this.props.getReplacementAnalytics(analytics,is_accessToken);
    await this.props.getOccupancyAnalytics(analytics,is_accessToken);
    await this.props.getStayAnalytics(analytics,is_accessToken);
    await this.props.getAllocationAnalytics(analytics,is_accessToken);
    await this.props.getProgram_AllocationAnalytics(analytics,is_accessToken);
    await this.props.getMarket_Analytics(analytics,is_accessToken);
    await this.props.get_ROC_Calibration_Analytics(analytics,is_accessToken);
    await this.props.get_PCR_Calibration_Analytics(analytics,is_accessToken);
    await this.props.getGender_Analytics(analytics,is_accessToken);
    await this.props.GetAge_Analytics(analytics,is_accessToken);
    const demo = {
      q: "lang",
      start_date: analytics.start_date,
      end_date: analytics.end_date,
      days_count: analytics.days_count,
    };
    await this.props.get_Demo_Analytics(demo,is_accessToken);
    let data = {
      start_date: analytics.start_date,
      end_date: analytics.end_date,
      days_count: analytics.days_count,
      referral_source: "0"
    }
    
    await this.props.getPerformance_Analytics(data,is_accessToken)
    this.setState({ isLoading: false });
  };

  getTotalAnalytics = async (filter: any) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    this.setState({ isLoading: true });
    await this.props.getDateAnalytics(filter,is_accessToken);
    this.setState({ isLoading: false });
  };

  getProgramAnalytics = async (filter: any) => {
    const is_accessToken: any = this.state.accessToken
    this.setState({ isLoading: true });
   await this.props.getPCRAnalytics(filter,is_accessToken);
    await this.props.getROCAnalytics(filter,is_accessToken);
    this.setState({ isLoading: false });
  };
  getOtherAnalytics = async (filter: any, type) => {
    const is_accessToken: any = this.state.accessToken
    switch(type) {
      case 'others':
        try {
          this.setState({ isLoading: true });
          await this.props.getReplacementAnalytics(filter,is_accessToken);
          await this.props.getStayAnalytics(filter,is_accessToken);
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
      
      case 'occupancy':
        try {
          this.setState({ isLoading: true });
          await this.props.getOccupancyAnalytics(filter,is_accessToken);
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false }); 
        } 
        break;
       }
    
  };
  getPerformance = async (filter: any) => {
    const is_accessToken: any = this.state.accessToken
    this.setState({ isLoading: true });
    await this.props.getPerformance_Analytics(filter,is_accessToken)
    this.setState({ isLoading: false });
  };
  getDemo = async (filter: any) => {
    const is_accessToken: any = this.state.accessToken
    this.setState({ isLoading: true });
    await this.props.get_Demo_Analytics(filter,is_accessToken)
    this.setState({ isLoading: false });
  };
  getCalibration = async (filter: any) => {
    const is_accessToken: any = this.state.accessToken
    this.setState({ isLoading: true });
    await this.props.get_PCR_Calibration_Analytics(filter,is_accessToken)
    this.setState({ isLoading: false });
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
    const tool_analytics_List = (analyticsState && analyticsState.ROC_Calibration_List) || [];
    const Cali_analytics_List = (analyticsState && analyticsState.PCR_Calibration_List) || [];
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
            PCRCalibrationList={Cali_analytics_List}
            Location={locationList}
            onFormSubmit={this.getDateAnalytics}
            totalAnalytics={this.getTotalAnalytics}
            Program_Analytics={this.getProgramAnalytics}
            Other_Analytics={this.getOtherAnalytics}
            Performance_Analytics={this.getPerformance}
            Demo_Analytics={this.getDemo}
            Calibration_Analytics={this.getCalibration}
            ROCCalibrationList={tool_analytics_List}
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
  get_ROC_Calibration_Analytics: analytics.actions.get_ROC_Calibration_Analytics,
  get_Demo_Analytics: analytics.actions.get_Demo_Analytics,
  get_PCR_Calibration_Analytics: analytics.actions.get_PCR_Calibration_Analytics
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(DashboardContainer));
