import React from "react";
import { connect } from "react-redux";
import axios from 'axios'
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import ChangePassword from "../components/changepassword";
import { domainPath } from "../App"
import { loginApiUrl } from '../api/api';
export interface ChangePasswordContainerState {
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
}

export interface ChangePasswordContainerProp extends ContainerProps {}

export class ChangePasswordContainer extends React.Component<
ChangePasswordContainerProp,
ChangePasswordContainerState
> {
  constructor(props: ChangePasswordContainerProp) {
    super(props);
    
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasLoginError: false,
      error: ""
    };
  }

  onLogin = async (old_password: string,password: string,retype_password: string) => {
    const { history, location } = this.props;
    this.setState({ isLoading: true });
    if (!old_password) {
      return false;
    }
    const changepwd: Types.ChangePwd = {
      old_password: old_password,
      password: password,
      retype_password: retype_password,
           
    };
    const user_id = this.props.user && this.props.user.user && this.props.user.user.user_id;
    const token = this.props.user && this.props.user.user && this.props.user.user.accessToken;
    const is_configured : any = this.props.user && this.props.user.user && this.props.user.user.is_fully_configured;
    try {
  await axios.patch(`${loginApiUrl}/organizations/${domainPath}/users/${user_id}/`, changepwd, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  history.push(is_configured !== true ? (`/${domainPath}/welcomepage`) :
      (`/${domainPath}/new-client`));
    } catch (e) {
      const error = e.data.message;
      this.setState({
        error,
        hasLoginError: true,
        isLoading: false
      });
      this.setState({ isLoading: false });
      return;
    }
  };

  render() {
    return <ChangePassword onLogin={this.onLogin} {...this.state} />;
  }
}

export default connect(/* istanbul ignore next */ state => state)(
  ChangePasswordContainer
);
