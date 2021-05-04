/** @jsx jsx */
import React,{ useState, useEffect } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { AppState } from "../redux-modules/root";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
// import * as user from "../redux-modules/user";
import * as user from "../redux-modules/user";
import { domainPath } from "../App" 
import { loginApiUrl } from "../api/api"; 
import {
  backdrop,
  } from "./styles";

export interface LogoutProps {
  appState: AppState;
  logout: (accessToken:any) => void;
  
}

const LOGOUT: React.FC<LogoutProps> = props => {
  const history = useHistory();
  const {  logout, appState } = props;
  const { user } = appState;
  const accessToken = user?.user.accessToken 
  const [isLoading, setLoading] = useState(false);
   useEffect(() => {
     setLoading(true)
    const fetchDataAsync = async () => {
      await logout(accessToken);
     await setLoading(false)
      history.push(`/${domainPath}/login`);
     }   
    fetchDataAsync()
  
   }, []);
return (
    <div>
       <Backdrop css={backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    appState: state
  };
};

const mapDispatchToProps = {
  logout: user.actions.logout,
  
};

export default connect(mapStateToProps, mapDispatchToProps)(LOGOUT);

