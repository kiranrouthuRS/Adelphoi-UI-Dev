import React from "react";
import { connect } from "react-redux";
import * as Types from "../api/definitions";
import { ContainerProps } from "./Container";
import LoginPage from "../components/Login";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as user from "../redux-modules/user";
import { AppState } from "../redux-modules/root";
import { domainPath } from "../App"
import { store } from "../index";
export interface LoginContainerState {
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
 
}
export interface LoginContainerProp extends ContainerProps,
WithSnackbarProps {
  login: (credential: any) => Promise<void>;
}

export class LoginContainer extends React.Component<
  LoginContainerProp,
  LoginContainerState
> {
  constructor(props: LoginContainerProp) {
    super(props);
    const isLoggedIn: any = props.user && props.user.user;
    console.log(isLoggedIn)
    if (isLoggedIn.accessToken) {
      this.props.history.push(domainPath !== "adelphoi" ? (`/${domainPath}/welcomepage`) :
      (`/${domainPath}/new-client`));
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
      const res: any = await this.props.login(credentials);
      console.log(res)
      console.log(store.getState())
      console.log(this.props)
      //const accessToken = store.getState().user.user.accessToken;
      const pwd_updated = this.props.user && this.props.user.user && this.props.user.user.is_pwd_updated;
      const is_configured:any = this.props.user && this.props.user.user && this.props.user.user.is_fully_configured;
      if(res.status === "success"){
        if(pwd_updated){
          history.push(is_configured !== true ? (`/${domainPath}/welcomepage`) :
          domainPath == "adelphoiDDD" ? (`/${domainPath}/new-client`):(`/${domainPath}/new-client`));;
          
        }else{
          history.push(`/${domainPath}/changepassword`);
        } 
      }else{
        this.setState({
          error: res.message,
          hasLoginError: true,
          isLoading: false
        });
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
const mapStateToProps = (state: AppState) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  login: user.actions.login,
  
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(LoginContainer));
// export default connect( state => state)(
//   LoginContainer
// );
