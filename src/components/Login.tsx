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
import { domainPath } from "../App";
import { loginApiUrl, sendTicket } from "../api/api"; 

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
const customStyles1 = {
content: {
top: '50%',
left: '50%',
right: 'auto',
bottom: 'auto',
marginRight: '-50%',
height: '75%',
width: '50%',
transform: 'translate(-20%, -50%)'
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
  const [isOpen, setisOpen] = React.useState(false);
  const [selectedFile, setselectedFile] = React.useState();
  const [subject, setSubject] = React.useState("");
  const [email_id, setEmail] = React.useState("");
  const [description, setDescription] = React.useState("");
  function openModal() {
    setIsOpen(true);
  }
 
  function closeModal(){
    setIsOpen(false);
    
  }
  const handleClose = () => {
    setisOpen(false)
    setSubject("")
    setDescription("")
    setEmail("")
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
      formData.append('email_id', email_id)
      formData.append('subject', subject)
      formData.append('description', description)
      
  
      if(files){
        for (let i = 0; i < files.length; i++) {
          formData.append(`attachments`, files[i])
      }
      }
      
      const res = await sendTicket(formData,"email_id");
      console.log(res)
      if (res.message === "your ticket raised") {
          setisOpen(false)
          setEmail("")
          setSubject("")
          setDescription("")
          alert(res.message) 
        } else{
          console.log(res.attachments)
          alert(res.attachments ? res.attachments[0].errors : res.message)
        }
  }
  const initialValues: LoginFormValues = { email: "", password: "", email_id: "", forgotpassword: false };    
  const { error } = props;
  let domain = domainPath.charAt(0).toUpperCase() + domainPath.substr(1).toLowerCase();
        domain = domain === "Perseus-house" ? "Perseus House, Inc." : domain 
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
          >
              Login to FirstMatch&reg; for <small>{domain}</small>
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
                   setMessage(response.data.status === "failed"?response.data.message:"Reset password sent successfully to provided Email ID")
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
         
          {isOpen && ( 
            <React.Fragment>
            
                <Modal
                  isOpen={isOpen}
                  ariaHideApp={false}
                  onRequestClose={handleClose}
                  style={customStyles1}
                  contentLabel="Example Modal"
                >
                 <div css={fieldRow}>
                <div css={twoCol}>
                  <label css={label}>Email ID:</label>
                  <input
                    type="text"
                    name="email_id"
                    css={inputField}
                    placeholder=""
                    value={email_id}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                  />
                  {/* <ErrorMessage component="span" name="first_name" /> */}
                </div>
                </div>
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
                </React.Fragment>
          )}
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
              <div style={{position: "absolute"}}>
            <div css={btn_container}>
              <button onClick={isOpenModal} css={fixed_button} style={{position: "fixed"}}>
                Need Help? 
                </button> 
                </div>
                </div>
              </div>
        
        </Container>
      </div>
  );
};

export default Login;
