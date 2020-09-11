/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/core";
import { withRouter, Route } from "react-router-dom";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import * as user from "./redux-modules/user";
import { AppState } from "./redux-modules/root";
import {  Global } from "@emotion/core";
import { domainPath } from "./App"
import { loginApiUrl } from "./api/api"
import { store } from "./index"; 
import {
  ConfigIcon,
  NewClientIcon,
  ExistingClientIcon
} from "./components/icons";
 
const App = css`
  margin: 80px auto;
  width: 100%;
  background-color: #fff;
  padding: 16px;
  position: relative;
  @media all and (min-width: 520px) { 
    padding: 40px;
    margin: 100px auto;
    width: 60vw;
  }
  @media all and (min-width: 520px) and (max-width: 1024px) {
    width: 90vw;
  }
`;

const nav = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 50px;
  @media all and (min-width: 520px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const menuButton = css`
  width: 260px;
  height: 140px;
  @media all and (max-width: 520px) {
    width: 110px;
    height: 80px;
    font-size: 12px !important;
  }
  @media all and (max-width: 768px) {
    font-size: 16px;
  }
  cursor: pointer;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  border-radius: 4px !important;
  font-size: 26px;
  color: #9c9c9c;
  @media all and (min-width: 520px) {
    &:not(:last-child) {
      border-right: 2px solid #c4c4c4 !important;
    }
  }
`;
const menuIcon = css`
  font-size: 72px !important;
  margin-bottom: 8px;
  @media all and (max-width: 520px) {
    font-size: 36px !important;
  }
`;

const logo = css`
  position: relative;
`;

const firstMatchLogo = css`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: -50px;
  @media all and (max-width: 520px) {
    width: 140px;
  }
`;

const adelphoiLogo = css`
  position: absolute;
  top: -25px;
  left: -12px;
  @media all and (max-width: 520px) {
    top: 0;
    right: 0;
  }
`;
const logout = css`
  position: absolute;
  top: -25px;
  right: -25px;
  radius: 2px;
  
  @media all and (max-width: 520px) {
    top: 0;
    right: 0;
  }
`;
const profile = css`
  position: absolute;
  top: -25px;
  right: 85px;
  radius: 2px;
  @media all and (max-width: 520px) {
    top: 0;
    right: 25;
  }
`;

const billing = css`
  position: absolute;
  top: -25px;
  right: 175px;
  radius: 2px;
  @media all and (max-width: 520px) {
    top: 0;
    right: 15;
  }
`;

const AppShell: React.FC = ({children},props ) => {
 const is_configured = children&&children[1].props.user.user.is_fully_configured  
const logopath = children&&children[1].props.user.user.logo_path; 
 
 return ( 
    <Paper css={App} elevation={3}>
      
      <div css={logo}>
        <img
          css={firstMatchLogo}
          alt="First Match Logo"
          src="/img/logo_stroke.png"
        />
        <img
          css={adelphoiLogo}
          alt={`${domainPath} Logo`}
          src={`${loginApiUrl}/${logopath}`}
        />
        <a
              href={`/${domainPath}/billing`}
              css={billing}
            >
              Billing
            </a>
        <a
              href={`/${domainPath}/changepassword`}
              css={profile}
            >
              Profile
            </a>
                <a
              href={`/${domainPath}/logout`}
              css={logout}
            >
              Logout
            </a>
      </div>
      
           <div css={nav}>
           {is_configured === true ?
                 <Route
                   path={domainPath === "adelphoi"?`/${domainPath}/new-client`:`/${domainPath}/new-client1`}
                   // exact={activeOnlyWhenExact}
                   children={({ match, history }) => ( 
                     <Link
                       onClick={() => {
                         history.push(domainPath === "adelphoi"?`/${domainPath}/new-client`:`/${domainPath}/new-client1`);
                       }}
                       css={menuButton}
                       style={
                         match
                           ? { backgroundColor: "#8284e5", color: "white" }
                           : { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                       }
                     >
                      {is_configured === true ? <NewClientIcon
                         css={menuIcon}
                         fillColor={match ? "white" : "#9d9d9d"}
                       />
                       :""}
                      {is_configured === true ? "New Client" :""} 
                     </Link>
                   )}
                 />
                 :""}
         
                 <Route 
                   path={ is_configured === true ? `/${domainPath}/existing-client`:`/${domainPath}/configuration`}
                   children={({ match, history }) => (
                     <Link
                       onClick={() => {
                         history.push(is_configured === true ? `/${domainPath}/existing-client`:`/${domainPath}/configuration/users`);
                       }}
                       css={menuButton}
                       style={
                         match
                           ? { backgroundColor: "#8284e5", color: "white" }
                           : { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                       }
                     >
                      {is_configured === true ? <ExistingClientIcon
                         css={menuIcon}
                         fillColor={match ? "white" : "#9d9d9d"}
                       />:<ConfigIcon
                       css={menuIcon}
                       fillColor={match ? "white" : "#9d9d9d"}
                     />}
                     {is_configured === true ?  "Existing Client" :"Configuration"} 
                     </Link>
                   )}
                 />
                 {is_configured === true ?
                 <Route
                 path={`/${domainPath}/configuration`}
                 // exact={activeOnlyWhenExact}
                 children={({ match, history }) => (
                   <Link
                     onClick={() => {
                       history.push(`/${domainPath}/configuration/users`); 
                     }}
                     css={menuButton}
                     style={
                       match
                         ? 
                         { backgroundColor: "#8284e5", color: "white" }
                         : { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                     }
                   >
                    {is_configured === true ? <ConfigIcon
                       css={menuIcon}
                       fillColor={match ? "white" : "#9d9d9d"}
                     />:""} 
                     {is_configured === true ? "Configuration":""}
                   </Link>
                 )}
               />
                 :""}
                 
               </div>
     
        <div css={nav}>
      {/* <Route
        path={`/${domainPath}/configuration`}
        // exact={activeOnlyWhenExact}
        children={({ match, history }) => (
          <Link
            onClick={() => {
              history.push(`/${domainPath}/configuration/users`);
            }}
            css={menuButton}
            style={
              match
                ? { backgroundColor: "#8284e5", color: "white" }
                : { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
            }
          >
           
          </Link>
        )}
      /> */}
      
      </div>
      
      {children}
      
    </Paper>
    
  );
};

export default withRouter(AppShell);

 
