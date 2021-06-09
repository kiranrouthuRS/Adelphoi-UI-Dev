import * as React from 'react';
import { connect } from "react-redux";
import { AppState } from "../redux-modules/root";
import { ContainerProps } from "./Container";
import { withSnackbar, WithSnackbarProps } from "notistack";
import BillingDetails from '../components/BillingDetails';
import * as Types from "../api/definitions";
interface MatchParams {
  index: string;
}
export interface BillingDeatilsContainerState {
  
}
export interface BillingDeatilsContainerProps
  extends ContainerProps<MatchParams>,
  WithSnackbarProps {
  
}

export class BillingDeatilsContainer extends React.Component<
  BillingDeatilsContainerProps,
  BillingDeatilsContainerState
  > {
  constructor(props: BillingDeatilsContainerProps) {
    super(props);
    this.state = {
      loginInfo: Types.emptyBilling, 
      showLoginFailedMsg: false,
    };
  }
   render() {
  const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    return (
    
    <BillingDetails
            accessToken={is_accessToken}
            />
    );
  }
}

const mapStateToProps = (state: AppState) => { 
  return {
    user: state.user,
    
  };
};
export default connect(
  mapStateToProps,
  null
)(BillingDeatilsContainer);
