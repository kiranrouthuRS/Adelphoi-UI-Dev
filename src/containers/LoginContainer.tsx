import React from "react";
import { connect } from "react-redux";
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import LoginPage from "../components/Login";
import * as user from "../redux-modules/user";
import { domainPath } from "../App"
import { store } from "../index";
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
    // if (isLoggedIn && isLoggedIn.accessToken !== "") {
    //   console.log(domainPath,'domainPath')
    //   this.props.history.push(domainPath !== "adelphoi" ? (`/${domainPath}/welcomepage`) :
    //   (`/${domainPath}/new-client`));
    // }
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasLoginError: false,
      error: "",
     
    };
  }

  onLogin = async (email: string,password: string) => {
    const { history, location } = this.props;

    if (!email) {
      return false;
    }
    const credentials: Types.Credential = {
      email: email,
      password: password,
      domain: domainPath
      
    };
    try {
      const r = await this.props.dispatch(user.actions.login(credentials));
      const accessToken = store.getState().user.user.accessToken;
      const pwd_updated = this.props.user && this.props.user.user && this.props.user.user.is_pwd_updated
      const is_configured:any = this.props.user && this.props.user.user && this.props.user.user.is_fully_configured;
      if(pwd_updated){
        history.push(is_configured !== true ? (`/${domainPath}/welcomepage`) :
        domainPath == "adelphoiDDD" ? (`/${domainPath}/new-client`):(`/${domainPath}/new-client`));;
        
      }else{
        history.push(`/${domainPath}/changepassword`);
      }
     
    } catch (e) {
      console.log(e,"error");
      const error = "Invalid Credentials"; 
      this.setState({
        error,
        hasLoginError: true,
        isLoading: false
      });
      return;
    }
  };

  render()
   
  {
    return <LoginPage onLogin={this.onLogin} {...this.state} />;
  }
}

export default connect(/* istanbul ignore next */ state => state)(
  LoginContainer
);
