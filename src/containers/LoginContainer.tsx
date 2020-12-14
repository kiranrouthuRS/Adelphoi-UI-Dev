import React from "react";
import { connect } from "react-redux";
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import LoginPage from "../components/Login";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as user from "../redux-modules/user";
import { domainPath } from "../App"
import { store } from "../index";
export interface LoginContainerState {
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
 
}

export interface LoginContainerProp extends ContainerProps {
  login: (data: any) => Promise<void>;
}

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
      await this.props.login(credentials); 
      const accessToken = store.getState().user.user.accessToken; 
      console.log(store.getState())
      const is_configured:any = store.getState().user.user.is_fully_configured;
      const pwd_updated = store.getState().user.user.is_pwd_updated
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
const mapDispatchToProps = {
  login: user.actions.login,

};

export default connect(
  null,
  mapDispatchToProps
)(LoginContainer);
// export default connect(/* istanbul ignore next */ state => state)(
//   LoginContainer
// );
