/** @jsx jsx */
import React, {useState,useEffect} from "react";
import { SnackbarProvider } from "notistack";
import createHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
import { connect } from "react-redux";
//import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./redux-modules/configureStore";
import Button from "@material-ui/core/Button";
import { AppState } from "./redux-modules/root";
import * as user from "./redux-modules/user";
import { jsx, css } from "@emotion/core";  
import Modal from "react-modal";
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
import {AppBar, Container, Toolbar, Typography  } from "@material-ui/core";
import Footer from './components/Footer'
import PageNotFound from './components/PageNotFound'
import { Translate } from "@material-ui/icons";
import { sendTicket } from "./api/api"
import {
  subHeading,
   fieldRow,
   fieldBox,
   twoCol,
   inputField,
   tableHeader,
   tableRow,
   dataTable,
   label,
   selectField,
   backdrop
 } from "./components/styles";
export const { store } = configureStore(createHistory());
const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let dom = str1[1];
  export const domainPath = dom; 
  export interface AppProps {
    appState: AppState;
    logout: (accessToken:any) => void;
    
  }

  const btn_container = css`
  transform: translate(1360px, 127px);
  position: fixed;
`;

const fixed_button = css`
  transform: rotate(-90deg);
 height: 40px;
 width: 180px;
 font-size: 24px;
 background-color: #8F00FF;
 color: #fff;
 border: 2px solid #8F00FF;
 border-radius: 3px;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    height: '50%',
    width: '50%',
    transform: 'translate(-20%, -50%)'
  }
};

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
        localStorage.removeItem("user_role")
         //logout(accessToken);
        //  localStorage.clear()
        //history.push(`/${domainPath}/new-client`);
      }
      
    }
    
},[localStorage.refreshToken])
const [isOpen, setisOpen] = useState(false);
const [selectedFile, setselectedFile] = useState();
const [subject, setSubject] = useState("");
const [description, setDescription] = useState("");

    const handleClose = () => {
      setisOpen(false)
    }

    const isOpenModal = () => {
      setisOpen(true)
    }
   const onFileChange = event => {
    console.log(event.target.files)
    let file = event.target.files[0]
    console.log(file)
    setselectedFile( selectedFile ? selectedFile.concat(event.target.files[0]) : [event.target.files[0]] );
    
    };
   const onSubmitTicket = async() => {
        let file: any = selectedFile
        console.log(file)
        const formData = new FormData(); 
        formData.append('subject', subject)
        formData.append('description', description)
        if(file&&file.length>0){
          file.map(data=> (formData.append('attachments', data)))
        }
        
        const res = await sendTicket(formData);
        console.log(res)
          if (res.message === "your ticket raised") {
            setisOpen(false)
            alert(res.message)
          } else{
            alert(res.message ? res.message : "Something went wrong")
          }
  }
  
return (
  
    <React.Fragment>
      {/* <Header/>  */}
      <div css={btn_container}>
        <button onClick={isOpenModal} css={fixed_button} style={{position: "fixed"}}>
          Need Help?
          </button> 
          </div>
          <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Example Modal"
          >
           <div css={fieldRow}>
          <div css={twoCol}>
            <label css={label}>Subject:</label>
            <input
              type="text"
              name="first_name"
              css={inputField}
              placeholder=""
              value={subject}
              onChange={(e)=> setSubject(e.target.value)}
              required
            />
            {/* <ErrorMessage component="span" name="first_name" /> */}
          </div>
          </div>
          <div css={fieldRow}>
          <div css={twoCol}>
            <label css={label}>Description:</label>
            <textarea
              name="first_name"
              css={inputField}
              placeholder="Please provide as many details as you can, like the client code, page you are on, actions you took and the problemy you faced. Please attach a file or multiple files."
              style={{height:"150px"}} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {/* <ErrorMessage component="span" name="first_name" /> */}
          </div>
            </div>
            <div css={fieldRow}>
            <div css={twoCol}>
            <input type="file" name="uploadfiles" multiple  onChange={onFileChange} />  
            </div>
            <div css={twoCol}>  
           <strong style={{color: "#3f51b5",fontSize:"24px"}}> Attched {selectedFile && selectedFile.length > 0 ? selectedFile.length  : 0} Files. </strong>
            </div>
          <div css={twoCol}>
          <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              onClick={onSubmitTicket}
            >
              Submit
            </Button>
          </div>
          </div>
          </Modal>
      <Provider store={store}> 
       
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Router>
          
          <Switch>
             <Route exact path={`/${dom}`}>
             <Redirect to={`/${dom}/existing-client`} /> 
                  
                </Route>
                <Route
                  path={`/${dom}/login`}
                  component={LoginContainer} 
                />
                </Switch>
                <Switch>
                  <PrivateRoute path={`/${dom}/access_denied`} component={PageNotFound} roles={["Super Admin","Admin","Coordinator"]} />
                <PrivateRoute path={`/${dom}/welcomepage`} component={Welcomepage} roles={["Super Admin","Admin","Coordinator"]} />
                <PrivateRoute path={`/${dom}/new-client`} component={DynamicNewClientContainer} 
                              roles={["Super Admin","Admin","Coordinator"]} />
                {/* <PrivateRoute exact path={`/${dom}/new-client1`} component={DynamicNewClientContainer} /> */}
                <PrivateRoute
                  path={`/${dom}/existing-client`}
                  component={DynamicExistingClientContainer}
                  roles={["Super Admin","Admin","Coordinator"]}
                />
                <PrivateRoute
                  path={`/${dom}/configuration`}
                  component={ConfigurationContainer} 
                  roles={["Super Admin","Admin","Coordinator"]}
                />
                <PrivateRoute
                  path={`/${dom}/logout`}
                  component={LOGOUT}
                  roles={["Super Admin","Admin","Coordinator"]}
                />
                <PrivateRoute
                  path={`/${dom}/changepassword`}
                  component={ChangePasswordContainer}
                  roles={["Super Admin","Admin","Coordinator"]}
                />
                <PrivateRoute
                  path={`/${dom}/dashboard`}
                  component={DashboardContainer}
                  roles={["Super Admin","Admin","Coordinator"]}
                />
                <PrivateRoute
                  path={`/${dom}/billing`}
                  component={BillingDetailsContainer} 
                  roles={["Super Admin","Admin"]}
                />
                 <PrivateRoute
                  path={`/${dom}/notifications`}
                  component={NotificationsContainer} 
                  roles={["Super Admin","Admin","Coordinator"]}
                />
              </Switch>
              
              
           </Router>
        </SnackbarProvider>
      </Provider>
      <Footer/>
      
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
