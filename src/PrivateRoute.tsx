/** @jsx jsx */
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AppState } from "./redux-modules/root";
import * as user from "./redux-modules/user";
import AppShell from "./AppShell";
import { css, jsx, Global } from "@emotion/core";
import { domainPath } from "./App"
import { store } from "./index";
export interface PrivateRouteProps extends RouteProps {
  appState: AppState;
   user : any;
}

  
const PRoute: React.FC<PrivateRouteProps> = (props) => {
  const { user, ...routeProps   } = props;  
  //const { user } = appState;
  //const accessToken = store.getState().user.user.accessToken; 
  if (localStorage.refreshToken === undefined) {
    return (
      <React.Fragment>
        
         <Redirect
        to={{
          pathname: `/${domainPath}/login`,
          state: { from: routeProps.location }
        }}
      />
      </React.Fragment>
            
    );
  }
  return (
    <React.Fragment>
      
     <AppShell> <Route {...routeProps} /></AppShell>
    </React.Fragment>    
  
      
)};

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    appState: state,
  }
};

const mapDispatchToProps = { logout: user.actions.logout };

export default connect(
  mapStateToProps,
  
)(PRoute);
