import * as React from 'react';
import { connect } from "react-redux";
import { AppState } from "../redux-modules/root";
import { ContainerProps } from "./Container";
import { Switch, Route } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as notifications from "../redux-modules/notifications";
import Notifications1 from '../components/Notifications1';
import Notifications2 from '../components/Notifications2';
import Notifications3 from '../components/Notifications3';
import Notifications4 from '../components/Notifications4';
import { format } from "date-fns";
import { Download_Notifications } from "../api/api";
import { domainPath } from "../App"
import * as Types from "../api/definitions";
interface MatchParams {
  index: string;
}

export interface NotificationsContainerState {
    isLoading: boolean;
    error: string;
 
}
export interface NotificationsContainerProps
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
    getPendingNotifications: (accessToken:any, type: any, startdate?:any, enddate?:any) => Promise<void>;
    getPCRNotifications: (accessToken:any, type: any, startdate?:any, enddate?:any) => Promise<void>;
    getROCNotifications: (accessToken:any, type: any, startdate?:any, enddate?:any) => Promise<void>;
}

export class NotificationsContainer extends React.Component<
  NotificationsContainerProps,
  NotificationsContainerState
  > {
  constructor(props: NotificationsContainerProps) {
    super(props);
    this.state = {
      isLoading: false,
      error: "",
   
    };
  }
  
  getAllNotifications = async(Type: any) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    this.setState({ isLoading: true });
    switch(Type) {
      case 'pending':
        try {
              this.setState({ isLoading: true });
              await this.props.getPendingNotifications(is_accessToken,"pending");
              this.setState({ isLoading: false});
             } catch (error) {
              console.log(error);
              this.setState({ isLoading: false });
              this.props.enqueueSnackbar("An error occurred." + error);
            }
        break;
      
      case 'pcr':
        try {
          this.setState({ isLoading: true });
          await this.props.getPCRNotifications(is_accessToken,"pcr");
          this.setState({ isLoading: false});
         } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
          this.props.enqueueSnackbar("An error occurred." + error);
        }
       break;
 
      case 'roc':
        try {
          this.setState({ isLoading: true });
          await this.props.getROCNotifications(is_accessToken,"roc");
          this.setState({ isLoading: false});
         } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
          this.props.enqueueSnackbar("An error occurred." + error);
        }
        break;
      }
    
  }

  Notifications_DateRange = async (Type: any, startDate: any, endDate: any) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    switch(Type) {
      case 'pending':
        try {
          this.setState({ isLoading: true });
          await this.props.getPendingNotifications(is_accessToken,Type,startDate,endDate); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
      
      case 'pcr':
        try {
          this.setState({ isLoading: true });
          await this.props.getPCRNotifications(is_accessToken,Type,startDate,endDate); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
 
      case 'roc':
        try {
          this.setState({ isLoading: true });
          await this.props.getROCNotifications(is_accessToken,Type,startDate,endDate); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
      }
           
  };

  DownloadReport = async (Type: any, startDate: any, endDate: any) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    let start_date = startDate ? format(new Date(startDate), "yyyy-MM-dd") : ""
    let end_date = endDate ? format(new Date(endDate), "yyyy-MM-dd") : ""
    switch(Type) {
      case 'pending':
        try {
          this.setState({ isLoading: true });
          await Download_Notifications(Type,start_date,end_date,is_accessToken); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
      
      case 'pcr':
        try {
          this.setState({ isLoading: true });
          await Download_Notifications(Type,start_date,end_date,is_accessToken); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false }); 
        } 
        break;
 
      case 'roc':
        try {
          this.setState({ isLoading: true });
          await Download_Notifications(Type,start_date,end_date,is_accessToken); 
          this.setState({ isLoading: false });
        } catch (error) {
          console.log(error);
          this.setState({ isLoading: false });
        } 
        break;
      }
  }

   render() {
    const {
      notifications: notificationState,
     } = this.props;
    const pendingData = (notificationState && notificationState.pendingList) || [];
    const pcrData = (notificationState && notificationState.pcrList) || [];
    const rocData = (notificationState && notificationState.rocList) || [];
   return (
      <Switch>
      <Route exact path={`/${domainPath}/notifications/pending`}>
        <Notifications2
        {...this.state}
          Notification_data={pendingData}
          onSearch={this.Notifications_DateRange}
          downloadReport={this.DownloadReport}
          
        />
      </Route>
      <Route exact path={`/${domainPath}/notifications/pcr`}>
        <Notifications3
        {...this.state}
          Notification_data={pcrData}
          onSearch={this.Notifications_DateRange}
          downloadReport={this.DownloadReport}
        />
      </Route><Route exact path={`/${domainPath}/notifications/roc`}>
        <Notifications4
        {...this.state}
         Notification_data={rocData}
         onSearch={this.Notifications_DateRange} 
         downloadReport={this.DownloadReport}
        />
      </Route>
      <Route exact path={`/${domainPath}/notifications`}>
         <Notifications1 
           getNotifications = {this.getAllNotifications}
         />
      </Route>
    </Switch>
   
    );
  }
}

const mapStateToProps = (state: AppState) => { 
  return {
    user: state.user,
    notifications: state.notifications
    
  };
};
const mapDispatchToProps = {
  getPendingNotifications: notifications.actions.getPendingNotifications,
  getPCRNotifications: notifications.actions.getPCRNotifications,
  getROCNotifications: notifications.actions.getROCNotifications,
  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps)(NotificationsContainer);
