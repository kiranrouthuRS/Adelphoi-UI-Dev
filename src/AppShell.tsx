/** @jsx jsx */
import React, {useState,useEffect} from "react";
import { jsx, css } from "@emotion/core";
import { withRouter, Route } from "react-router-dom";
import { Link as RouterLink, useHistory, Switch } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import { domainPath } from "./App"
import { loginApiUrl } from "./api/api"
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Sidemenu from './Sidemenu'
import { store } from "./index";
import { sendTicket } from "./api/api"
import IdleTimerContainer from './containers/IdleTimerContainer'
import {
  ConfigIcon,
  NewClientIcon,
  ExistingClientIcon
} from "./components/icons";
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
const App = css`
  margin: 50px auto;
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
  margin-top: 30px;
  margin-bottom: 30px;
  @media all and (min-width: 520px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const menuButton = css`
  width: 460px;
  height: 50px;
  @media all and (max-width: 520px) {
    width: 70px;
    height: 35px;
    font-size: 6px !important;
  }
  @media all and (max-width: 768px) {
    font-size: 6px;
  }
  cursor: pointer;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  border-radius: 0px !important;
  font-size: 12px;
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
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const firstMatchLogo = css`
  //position: absolute;
  // transform: translate(-50%, -30%);
  left: 35%;
  top: -25px;
  // height: auto; 
  width: 100%;
  height: 100%;
  object-fit: contain;
  @media all and (max-width: 520px) {
    width: 80px;
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
  right: 14px;
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
const btn_container = css`
      position: fixed;
      top: 50%;
      right: 0px;
      width: 115px;
        
`;

const fixed_button = css`
      transform: rotate(-90deg);
      -webkit-transform: rotate(-90deg); 
      -moz-transform: rotate(-90deg); 
      -o-transform: rotate(-90deg); 
      display: block; 
      margin-left: 10px;
      text-align:center;
      width: 165px;
      padding: 8px 16px;
      background-color: #8F00FF;
      color: #fff;
      border: 2px solid #8F00FF;
      border-radius: 3px;
      font-family: Arial, sans-serif; 
      font-size: 17px; 
      font-weight: bold; 
      text-decoration: none;  
      border-radius: 4px;
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

const AppShell: React.FC = ({ children }, props) => {
  const is_configured = children && children[1].props.appState.user.user.is_fully_configured
  const logopath = children && children[1].props.appState.user.user.logo_path;
  const headerColor = children && children[1].props.appState.user.user.header_color;
  const [isOpen, setisOpen] = useState(false);
const [selectedFile, setselectedFile] = useState();
const [subject, setSubject] = useState("");
const [description, setDescription] = useState("");

    const handleClose = () => {
      setisOpen(false)
      setSubject("")
      setDescription("")
    }

    const isOpenModal = () => {
      setisOpen(true)
    }
   const onFileChange = event => {
    let file = event.target.files[0]
    setselectedFile(event.target.files );
    
    };
   const onSubmitTicket = async() => {
        let files: any = selectedFile
        const formData = new FormData(); 
        formData.append('subject', subject)
        formData.append('description', description)
        

        if(files){
          for (let i = 0; i < files.length; i++) {
            formData.append(`attachments`, files[i])
        }
        }
        
        const res = await sendTicket(formData);
        console.log(res)
        if (res.message === "your ticket raised") {
            setisOpen(false)
            setSubject("")
            setDescription("")
            alert(res.message) 
          } else{
            alert(res.message ? "Allowed formats are png,jpg,jpeg,pdf,xls,xlsx,csv . Required 1 MB file." : "Something went wrong")
          }
  }
 return (
    <Paper css={App} elevation={3}>
      <IdleTimerContainer />
      
      <div css={logo}>
        <img
          css={firstMatchLogo}
          alt={`${domainPath} Logo`}
          src={`${loginApiUrl}/${logopath}`}
         />
        {/* <img
          css={adelphoiLogo}
          alt={`${domainPath} Logo`}
          src={`${loginApiUrl}/${logopath}`}
        /> */}
        {/* <Sidemenu /> */}
      </div>
      <div css={nav}>
        {is_configured === true ?
          <React.Fragment>
            {domainPath === "adelphoi" && 
            <Route
              path={`/${domainPath}/dashboard`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/dashboard`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "Dashboard" : ""}
                </Link>
              )}
            />
                }
            <Route
              path={`/${domainPath}/new-client`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/new-client`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "New Client" : ""}
                </Link>
              )}
            />
            <Route
          path={is_configured === true ? `/${domainPath}/existing-client` : `/${domainPath}/configuration`}
          children={({ match, history }) => (
            <Link
              onClick={() => {
                history.push(is_configured === true ? `/${domainPath}/existing-client` : `/${domainPath}/configuration/users`);
              }}
              css={menuButton}
              style={
                match
                  ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                  : { backgroundColor: headerColor, color: "white" }
              }
            >
              {is_configured === true ? "Existing Client" : "Users"}
            </Link>
          )}
        />
            <Route
              path={`/${domainPath}/notifications`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/notifications`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "Notifications" : ""}
                </Link>
              )}
            />
            <Route
              path={`/${domainPath}/billing`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/billing`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "Billing" : ""}
                </Link>
              )}
            />
            <Route
              path={`/${domainPath}/changepassword`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/changepassword`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "Account" : ""}
                </Link>
              )}
            />
            
          </React.Fragment>
          : ""}

        
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
                    { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                    : { backgroundColor: headerColor, color: "white" } 
                }
              >
                
                {is_configured === true ? "Users" : ""}
              </Link>
            )}
          />
          : ""}
          <Route
              path={`/${domainPath}/logout`}
              // exact={activeOnlyWhenExact}
              children={({ match, history }) => (
                <Link
                  onClick={() => {
                    history.push(`/${domainPath}/logout`);
                  }}
                  css={menuButton}
                  style={
                    match
                      ? { backgroundColor: "#f5f5f5", color: "#9d9d9d" }
                      : { backgroundColor: headerColor, color: "white" }
                  }
                >
                  {is_configured === true ? "Logout" : ""}
                </Link>
              )}
            />
      </div>
      <div style={{position: "absolute"}}>
      <div css={btn_container}>
        <button onClick={isOpenModal} css={fixed_button} style={{position: "fixed"}}>
          Need Help? 
          </button> 
          </div>
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
           &nbsp;
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
        
      {children}

    </Paper>

  );
};

export default withRouter(AppShell);