/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import { domainPath } from "./App"
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

const Sidemenu: React.FC = (props) => {
  const history = useHistory();
    return(
        <div css={profile} className="dropdown"> 
  <button className="dropbtn">
    <MenuIcon style={{fontSize:"18px"}}/>
    <span >Menu</span></button>
  <div className="dropdown-content"> 
  <Link to={`/${domainPath}/dashboard`}>Dashboard</Link>
    <Link  to={`/${domainPath}/billing`}>Billing</Link>
    <Link to={`/${domainPath}/changepassword`}>Profile</Link>
    <Link to={`/${domainPath}/logout`}>Logout</Link>
    {/* <a href={`/${domainPath}/logout`}>Logout</a> */}
  </div>
</div>   
    );
}

export default Sidemenu;
