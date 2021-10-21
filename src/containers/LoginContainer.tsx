import React from "react";
import { connect } from "react-redux";
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import LoginPage from "../components/Login";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as user from "../redux-modules/user";
import * as dynamicclient from "../redux-modules/dynamicclient";
import { AppState } from "../redux-modules/root";
import { domainPath } from "../App"
export interface LoginContainerState {
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
 
}
export interface LoginContainerProp extends ContainerProps,
WithSnackbarProps {
  login: (credential: any) => Promise<void>;
  getConfiguredQuestions: (is_accessToken: any) => Promise<void>;
}

export class LoginContainer extends React.Component<
  LoginContainerProp,
  LoginContainerState
> {
  constructor(props: LoginContainerProp) {
    super(props);
    // const isLoggedIn: any = props.user && props.user.user;
    if (localStorage.refreshToken) {
      this.props.history.push(`/${domainPath}/existing-client`)
      
    }
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
    const { history} = this.props;

    if (!email) {
      return false;
    }
    const credentials: Types.Credential = {
      email: email,
      password: password,
      domain: domainPath
      
    };
    try {
      const res: any = await this.props.login(credentials);
      const pwd_updated = this.props.user && this.props.user.user && this.props.user.user.is_pwd_updated;
      const is_configured:any = this.props.user && this.props.user.user && this.props.user.user.is_fully_configured;
      const is_accessToken: any = this.props.user && this.props.user.user.accessToken
      if(res.status === "success"){
        localStorage.setItem("refreshToken", res&&res.response.token);
       localStorage.setItem("user_role", res&&res.response.role_type)
        await this.props.getConfiguredQuestions(is_accessToken) 
        if(pwd_updated){
          history.push(is_configured !== true ? (`/${domainPath}/welcomepage`) :
          (`/${domainPath}/existing-client`));;
          
        }else{
          history.push(`/${domainPath}/changepassword`);
        } 
      } else {
        const error = res.message ? res.message: "Something went wrong. Please try again later. "; 
        this.setState({
          error,
          hasLoginError: true,
          isLoading: false
        });
        return;
    }
      
    } catch (e) {
      console.log(e,"error"); 
      const error = e.data ? e.data.message ? e.data.message: "Something went wrong. Please try again later. ": "Something went wrong. Please try again later. "; 
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
const mapStateToProps = (state: AppState) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  login: user.actions.login,
  getConfiguredQuestions: dynamicclient.actions.getConfiguredQuestions,
  
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(LoginContainer));
// export default connect( state => state)(
//   LoginContainer
// );
