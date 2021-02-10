/** @jsx jsx */
import React from "react";
import { jsx, css, Global } from "@emotion/core";
import { Formik, FormikErrors } from "formik";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../image/logo.png";
//import "./Home.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { domainPath } from "../App"

import {
  wrap,
  subHeading,
  fieldRow, 
  mainContent,
  twoCol,
  inputField,
  label,
  fieldBox,
  selectField,
  datePicker
} from "./styles";

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

const useStyles = makeStyles(theme => ({
  link: {
    margin: theme.spacing(1, 1.5)
  },
  
  root: {
    // height: "80vh",
    width: "100%"
  },
  image: {
    background: "linear-gradient(to right, #0078ff, #00bfff)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  
  paper: {
    width: "auto",
    margin: theme.spacing(8, 4),
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
   
  },
  appBar: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingLeft: 8
  },
  submit: {
    width: "45%",
    height: "auto",
    // marginLeft: "100px",
    margin: theme.spacing(2, 0, 0),
    
  },
  logo: {
    width: "150px",
    height: "auto",
    marginRight: "10px",
    
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  brand: {
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    textDecoration: "none"
  },
  brandTitle: {
    display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
    fontSize: 25,
    color: "#1e3056"
  },
  errormsg: {
    display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
    fontSize: 15,
    color: "red"
  }
  
}));

interface LoginFormValues {
  password: string;
  email: string;
}

interface LoginFormProps {
  onLogin: (pin: string, emailid: string) => void;
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
}



const Welcomepage: React.FC<LoginFormProps> = props => {
  const classes = useStyles();
  const initialValues: LoginFormValues = { email: "", password: "" };
  const { error } = props;

  return (
    <div >
      <Container component="main" maxWidth="sm" css={App}>
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="div" variant="h2"
          className={classes.brandTitle}>
              Thank you for  registering with FirstMatch&trade;. Configuration is in Progress...
        </Typography >
              
              </div>
        
        </Container>
      </div>
  );
};

export default Welcomepage;
