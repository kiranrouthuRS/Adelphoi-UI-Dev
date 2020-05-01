import React from "react";
import { connect } from "react-redux";
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import LoginPage from "../components/Login";
import * as user from "../redux-modules/user";
import { domainPath } from "../App"
export interface LoginContainerState {
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
}

export interface LoginContainerProp extends ContainerProps {}

export class LoginContainer extends React.Component<
  LoginContainerProp,
  LoginContainerState
> {
  constructor(props: LoginContainerProp) {
    super(props);
    const isLoggedIn = props.user && props.user.user;
    console.log(props,"props")
    if (isLoggedIn && isLoggedIn.accessToken !== "") {
      console.log(domainPath,'domainPath')
      this.props.history.push(domainPath !== "adelphoi" ? (`/${domainPath}/welcomepage`) :
      (`/${domainPath}/new-client`));
    }
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasLoginError: false,
      error: ""
    };
  }

  onLogin = async (email: string,password: string) => {
    const { history, location } = this.props;

    if (!email) {
      return false;
    }
    const credentials: Types.Credential = {
      email: email,
      password: password
    };
    try {
      const r = await this.props.dispatch(user.actions.login(credentials));
      //let { from } = location.state || { from: { pathname: "/select" } };
       //history.push(from);
       console.log(r,"login")
     history.push(domainPath !== "adelphoi" ? (`/${domainPath}/welcomepage`) :
     (`/${domainPath}/new-client`));;
    } catch (e) {
      console.log(e,"error");
      const error = e.data.message;
      this.setState({
        error,
        hasLoginError: true,
        isLoading: false
      });
      return;
    }
  };

  render() {
    return <LoginPage onLogin={this.onLogin} {...this.state} />;
  }
}

export default connect(/* istanbul ignore next */ state => state)(
  LoginContainer
);
