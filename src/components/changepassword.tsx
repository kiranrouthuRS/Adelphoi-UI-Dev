/** @jsx jsx */
import React from "react";
import { jsx, css, Global } from "@emotion/core";
import { Formik, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { domainPath } from "../App"
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    fieldRow,
    backdrop
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

interface ChangePasswordValues {
    old_password: string;
    password: string;
    retype_password: string;
}

interface ChangePasswordProps {
    onLogin: (old_password: string, password: string, retype_password: string) => void;
    isLoading: boolean;
    error: string;
    hasLoginError: boolean;
}



const ChangePassword: React.FC<ChangePasswordProps> = props => {
    const classes = useStyles();
    const initialValues: ChangePasswordValues = { old_password: "", password: "", retype_password: "" };
    const { error } = props;
    const domain = domainPath.charAt(0).toUpperCase() + domainPath.substr(1).toLowerCase();
    return (
        <div >
            <Backdrop css={backdrop} open={props.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={classes.paper}>
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
                        const errors: FormikErrors<ChangePasswordValues> = {};
                        if (!values.old_password) {
                            errors.old_password = "Required";
                        }
                        if (!values.password) {
                            errors.password = "Required";
                        }
                        if (!values.retype_password) {
                            errors.retype_password = "Required";
                        }
                        return errors;
                    }}
                    onSubmit={values => {
                        props.onLogin(values.old_password, values.password, values.retype_password);

                    }}
                >
                    {({
                        values,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        errors,
                        touched
                    }) => (

                        <form className={classes.form} noValidate
                            onSubmit={handleSubmit}>
                            <Typography component="div" variant="h5"
                                className={classes.brandTitle}>
                                Change Password
                                </Typography >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                id="old_password"
                                label="Old_password"
                                name="old_password"
                                value={values.old_password || ""}
                                onChange={handleChange}
                                autoComplete="old_password"
                                autoFocus
                            />
                            {touched.old_password && errors.old_password ? <div style={{ color: "red" }}>{errors.old_password}</div> : null}
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
                            {touched.password && errors.password ? <div style={{ color: "red" }}>{errors.password}</div> : null}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="retype_password"
                                label="Retype_Password"
                                type="password"
                                id="retype_password"
                                value={values.retype_password || ""}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            {touched.retype_password && errors.retype_password ? <div style={{ color: "red" }}>{errors.retype_password}</div> : null}
                            <div css={fieldRow} style={{ justifyContent: "center" }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Update
          </Button>
                            </div>
                        </form>


                    )}
                </Formik>
            </div>

        </div>
    );
};

export default ChangePassword;
