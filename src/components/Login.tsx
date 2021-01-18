/** @jsx jsx */
import React from "react";
import axios from "axios";
import Modal from "react-modal";
import { jsx, css, Global } from "@emotion/core";
import { Formik, FormikErrors } from "formik";
import Container from "@material-ui/core/Container";
import * as Types from "../api/definitions";
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
export const loginApiUrl = "http://3.7.135.210:8005";
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
    width: "200px",
    paddingTop: 10,
    paddingLeft: 8
  },
  submit: {
    width: "45%",
    height: "auto",
    // marginLeft: "100px",
    margin: theme.spacing(2, 2, 2),
    
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

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -110%)'
  }
};

interface LoginFormValues {
  password: string;
  email: string;
  email_id: string;
  forgotpassword: boolean;
}

interface LoginFormProps {
  onLogin: (pin: string, emailid: string) => void;
  isLoading: boolean;
  error: string;
  hasLoginError: boolean;
}



const Login: React.FC<LoginFormProps> = props => {
  const classes = useStyles();
  const [modalIsOpen,setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState( '' );
  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal(){
    setIsOpen(false);
    
  }

  const initialValues: LoginFormValues = { email: "", password: "", email_id: "", forgotpassword: false };    
  const { error } = props;
  const domain = domainPath.charAt(0).toUpperCase() + domainPath.substr(1).toLowerCase();
  return (
    <div >
      
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarTitle}>
            {/* <RouterLink to="https://firstmatchcom.wpcomstaging.com/" className={classes.brand}> */}
            <a className={classes.brand} href="https://firstmatch.com/"> 
              <img src="/img/logo_stroke.png" alt="" className={classes.logo} />
              </a>
              </div>       
          </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" css={App}>
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="div" variant="h5"
          className={classes.brandTitle}>
              Login to First Match for {domain}
        </Typography >
              {error && (
                <Typography
                  component="div"
                  variant="body1"
                  color="error"
                  className={classes.errormsg}
                >
                  {error}
                </Typography>
              )}
              <Formik
                initialValues={initialValues}
                validate={values => {
                  const errors: FormikErrors<LoginFormValues> = {};
                  if(values.forgotpassword){
                    if (!values.email_id) {
                      errors.email_id = "Required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_id)
                    ) {
                      errors.email_id = "Invalid email address";
                    }
                  } else {
                    if (!values.email) {
                      errors.email = "Required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                      errors.email = "Invalid email address";
                    }
                    
                    if (!values.password) {
                      errors.password = "Required";
                    }
                  }
                  
                  return errors;
                }}
                onSubmit={async (values,{resetForm}) => {
                  if(values.forgotpassword){
                   const response = await axios.get(`${loginApiUrl}/organizations/${domainPath}/forgot-password?email_id=${values.email_id}`);
                    setMessage("Reset password sent successfully to provided Email ID")
                   resetForm();
                      return response;
                     
                  }
                  else{
                    await props.onLogin(values.email,values.password);
                  }
                  
                }}
              >
                {({
                  values,
                  setFieldValue,
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  errors,
                  touched
                }) => (
                  
          <form className={classes.form} noValidate
          onSubmit={handleSubmit}>
            
             <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email ID"
            name="email"
            value={values.email || ""}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
          />
          {touched.email && errors.email ? <div style={{color:"red"}}>{errors.email}</div> : null} 
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={values.password || ""}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {touched.password && errors.password ? <div style={{color:"red"}}>{errors.password}</div> : null}
          
          <Grid container>
            <Grid item >
              <Link href="#" variant="body2" onClick={openModal}>
                Forgot password
              </Link>
            </Grid>
           </Grid>
          <div css={fieldRow} style={{ justifyContent: "center" }}>
            
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          </div>
          
          <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <form>
        
        {message && message ? 
        <React.Fragment>
          <div style={{color:"#5cb85c"}}>{message}</div>
        <div css={fieldRow} style={{ justifyContent: "center" }}>
         <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            setFieldValue('forgotpassword', false, false)
            setMessage("")
            closeModal()
        }}
          
        >
          Ok
        </Button>
        </div>
        </React.Fragment>
         : 
         <React.Fragment>
           <Typography component="div" variant="h4"
          className={classes.brandTitle}>
              Forgot Password
        </Typography >
            <p className="text-center">Please enter registered Email ID below to get reset password.</p>
        
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email_id"
            label="Email ID"
            name="email_id"
            value={values.email_id || ""}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
          /> 
          {touched.email_id && errors.email_id ? <div style={{color:"red"}}>{errors.email_id}</div> : null}
          <div css={fieldRow} style={{ justifyContent: "center" }}>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                setFieldValue('forgotpassword', true, true)
                handleSubmit()
            }}
            >
              Submit
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                setFieldValue('forgotpassword', false, false)
                closeModal()
            }}
              
            >
              Close
            </Button>
            </div>
         </React.Fragment>
        }
        
        
            
          </form>
        </Modal>
        </form>
               
                  
                )}
              </Formik>
              </div>
        
        </Container>
      </div>
  );
};

export default Login;
