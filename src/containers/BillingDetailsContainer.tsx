import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import BillingDetails from '../components/BillingDetails';
import * as Types from "../api/definitions";


interface Props extends RouteComponentProps<any> {
}

interface State {
  loginInfo: Types.Billing;
  showLoginFailedMsg: boolean;
}

export class BillingDeatilsContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      loginInfo: Types.emptyBilling, 
      showLoginFailedMsg: false,
    };
  }

  private onLogin = () => {
    // if (isValidLogin(this.state.loginInfo)) {
    //   this.props.history.push('/about');
    // } else {
    //   this.setState({
    //     ...this.state,
    //     showLoginFailedMsg: true,
    //   });
    // }
  }

  private onUpdateLoginField = (name, value) => {
    // this.setState({
    //   loginInfo: {
    //     ...this.state.loginInfo,
    //     [name]: value,
    //   },
    // });
  }

  public render() {
    return (
    //   <CenteredView>
    //     <NotificationComponent
    //       message="Invalid login or password, please type again"
    //       show={this.state.showLoginFailedMsg}
    //       onClose={() => this.setState({ showLoginFailedMsg: false })}
    //     />
        // <Card>
        //   <CardHeader title="Billing Status" />
        //   <CardContent>  
        //     <BillingDetails
        //     //   onLogin={this.onLogin}
        //     //   onUpdateLoginField={this.onUpdateLoginField}
        //     //   loginInfo={this.state.loginInfo}
        //     />
        //   </CardContent>
        // </Card>
    //   </CenteredView>
    <BillingDetails
            //   onLogin={this.onLogin}
            //   onUpdateLoginField={this.onUpdateLoginField}
            //   loginInfo={this.state.loginInfo}
            />
    );
  }
}

export default BillingDeatilsContainer;
