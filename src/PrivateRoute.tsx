/** @jsx jsx */
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AppState } from "./redux-modules/root";
import * as user from "./redux-modules/user";
import AppShell from "./AppShell";
import { css, jsx, Global } from "@emotion/core";
import { domainPath } from "./App"
export interface PrivateRouteProps extends RouteProps {
  appState: AppState;
}


const PRoute: React.FC<PrivateRouteProps> = (props) => {
  const { appState, ...routeProps } = props;
  console.log(routeProps.location,"loc")
  const { user } = appState;
  console.log(user,"user")
  
  if (!user ||user.user.accessToken === "") {
    return (
      <React.Fragment>
        {/* <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }
          html {
            box-sizing: border-box;
          }
          html,
          body {
            padding: 0;
            margin: 0;
            background: url(img/repeated_bg.png);
            min-height: 100%;
            font-family: "Quicksand", Helvetica, sans-serif;
          }
        `}
      />  */}
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
      {/* <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }
          html {
            box-sizing: border-box;
          }
          html,
          body {
            padding: 0;
            margin: 0;
            background: url(img/repeated_bg.png);
            min-height: 100%;
            font-family: "Quicksand", Helvetica, sans-serif;
          }
        `}
      />   */}
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
  mapDispatchToProps
)(PRoute);
