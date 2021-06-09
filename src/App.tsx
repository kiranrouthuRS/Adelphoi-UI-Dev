/** @jsx jsx */
import React, {useEffect} from "react";
import { SnackbarProvider } from "notistack";
import createHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
import { connect } from "react-redux";
//import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./redux-modules/configureStore";
import { AppState } from "./redux-modules/root";
import * as user from "./redux-modules/user";
import { jsx } from "@emotion/core";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";
import NewClientContainer from "./containers/NewClientContainer";
import DynamicNewClientContainer from "./containers/DynamicNewClientContainer";
import ExistingClientContainer from "./containers/ExistingClientContainer";
import DynamicExistingClientContainer from "./containers/DynamicExistingClientContainer";
import ConfigurationContainer from "./containers/ConfigurationContainer";
import LoginContainer from "./containers/LoginContainer";
import LOGOUT from "./components/Logout";
import PrivateRoute from './PrivateRoute';
import Welcomepage from './components/welcomepage'
import ChangePasswordContainer from './containers/ChangePasswordContainer'
import BillingDetailsContainer from './containers/BillingDetailsContainer'
import NotificationsContainer from './containers/NotificationsContainer'
import DashboardContainer from './containers/Dashboardcontainer'
export const { store } = configureStore(createHistory());
const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let dom = str1[1];
  export const domainPath = dom; 
  export interface AppProps {
    appState: AppState;
    logout: (accessToken:any) => void;
    
  }
const App: React.FC<AppProps> = props => {
  const {  logout, appState } = props;
  const { user } = appState;
  const accessToken = store.getState().user.user?.accessToken 
  let is_configured: any = store.getState().user.user?.is_fully_configured; 
  useEffect(() => { 
    const entries: any = performance.getEntriesByType("navigation");
    const action = entries.map( nav => nav.type )
    if(action[0] !== "reload"){
      if(localStorage.refreshToken){
        localStorage.removeItem("refreshToken")
         //logout(accessToken);
        //  localStorage.clear()
        //history.push(`/${domainPath}/new-client`);
      }
      
    }
    
},[localStorage.refreshToken])

return (
    <React.Fragment>
      
      
      <Provider store={store}> 
       
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Router>
          
          <Switch>
             <Route exact path={`/${dom}`}>
             <Redirect to={`/${dom}/new-client`} /> 
                  
                </Route>
                <Route
                  path={`/${dom}/login`}
                  component={LoginContainer}
                />
                </Switch>
                <Switch>
                <PrivateRoute path={`/${dom}/welcomepage`} component={Welcomepage} />
                <PrivateRoute path={`/${dom}/new-client`} component={dom === "adelphoiDDD" ?NewClientContainer:DynamicNewClientContainer} />
                {/* <PrivateRoute exact path={`/${dom}/new-client1`} component={DynamicNewClientContainer} /> */}
                <PrivateRoute
                  path={`/${dom}/existing-client`}
                  component={dom === "adelphoiDDD" ? ExistingClientContainer:DynamicExistingClientContainer}
                />
                <PrivateRoute
                  path={`/${dom}/configuration`}
                  component={ConfigurationContainer} 
                />
                <PrivateRoute
                  path={`/${dom}/logout`}
                  component={LOGOUT}
                />
                <PrivateRoute
                  path={`/${dom}/changepassword`}
                  component={ChangePasswordContainer}
                />
                <PrivateRoute
                  path={`/${dom}/dashboard`}
                  component={DashboardContainer}
                />
                <PrivateRoute
                  path={`/${dom}/billing`}
                  component={BillingDetailsContainer} 
                />
                 <PrivateRoute
                  path={`/${dom}/notifications`}
                  component={NotificationsContainer} 
                />
              </Switch>
              
              
           </Router>
        </SnackbarProvider>
      </Provider>
       </React.Fragment> 
    
     
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
