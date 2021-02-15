/** @jsx jsx */
import React from "react";
import { SnackbarProvider } from "notistack";
import createHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
//import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./redux-modules/configureStore";
import { css, jsx, Global } from "@emotion/core";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";
import AppShell from "./AppShell";

import NewClientContainer from "./containers/NewClientContainer";
import DynamicNewClientContainer from "./containers/DynamicNewClientContainer";
import ExistingClientContainer from "./containers/ExistingClientContainer";
import DynamicExistingClientContainer from "./containers/DynamicExistingClientContainer";
import ConfigurationContainer from "./containers/ConfigurationContainer";
import LoginContainer from "./containers/LoginContainer";
import Logout from "./components/Logout"; 
import PrivateRoute from './PrivateRoute';
import Welcomepage from './components/welcomepage'
import ChangePasswordContainer from './containers/ChangePasswordContainer'
import BillingDetailsContainer from './containers/BillingDetailsContainer'
import DashboardContainer from './containers/Dashboardcontainer'
import IdleTimerContainer from './containers/IdleTimerContainer'
export const { store } = configureStore(createHistory());
const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let dom = str1[1];
  export const domainPath = dom; 
  
const App: React.FC = (props) => {
  let is_configured: any = store.getState().user.user?.is_fully_configured; 
  return (
    <React.Fragment>
      
      
      <Provider store={store}> 
      
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Router>
          
          <Switch>
         
                <Route exact path={`/${dom}`}>
                {is_configured&& is_configured === true ? (
                    <Redirect to={`/${dom}/new-client`} /> 
                  ):(
                    <Redirect to={`/${dom}/welcomepage`} /> 
                    
                  )}
                  
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
                  component={Logout}
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
              </Switch>
              
              
           </Router>
        </SnackbarProvider>
      </Provider>
       </React.Fragment> 
    
     
  );
};

export default App;
