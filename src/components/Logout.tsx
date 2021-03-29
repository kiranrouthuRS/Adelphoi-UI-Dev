/** @jsx jsx */
import React,{ useState, useEffect } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { AppState } from "../redux-modules/root";
// import * as user from "../redux-modules/user";
import * as user from "../redux-modules/user";
import { domainPath } from "../App" 
import { loginApiUrl } from "../api/api"; 



export interface LogoutProps {
  appState: AppState;
  logout: (accessToken:any) => void;
  
}

const Logout: React.FC<LogoutProps> = props => {
  const history = useHistory();
  const {  logout, appState } = props;
  const { user } = appState;
  const accessToken = user?.user.accessToken 
   useEffect(() => {
    const fetchDataAsync = async () => {
      await logout(accessToken);
      history.push(`/${domainPath}/login`);
     }   
    fetchDataAsync()
  
   }, []);
return (
    <div>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

