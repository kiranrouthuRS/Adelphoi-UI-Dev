/** @jsx jsx */
import React,{ useState, useEffect } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { AppState } from "../redux-modules/root";
// import * as user from "../redux-modules/user";
import * as user from "../redux-modules/user";
import { domainPath } from "../App" 
export const loginApiUrl = "http://3.7.135.210:8005"; 


export interface LogoutProps {
  appState: AppState;
  logout: () => void;
  
}

const Logout: React.FC<LogoutProps> = props => {
  const history = useHistory();
  const {  logout,appState, } = props;
  const { user } = appState;
   useEffect(() => {
    const fetchDataAsync = async () => {
       await logout();
     }   
    fetchDataAsync()
    history.push(`/${domainPath}/login`);
   }, []);
//     useEffect( () => {
//       logout();
//     const myHeaders = new Headers();
// myHeaders.append("Authorization", `Bearer ${currentUser}`);

// const formdata = new FormData();

// const req = {
//   method: "post",
//   headers: myHeaders,
//   body: formdata
// }
// fetch(`${loginApiUrl}/organizations/${domainPath}/logout`, req)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
  
//    history.push(`/${domainPath}/login`);
//    });
   
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

