import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { AppState } from "../redux-modules/root";
//import logo from ".../";
import * as user from "../redux-modules/user";
//import * as assessment from "../redux-modules/assessment";
//import * as patient from "../redux-modules/patient";

export interface HeaderProps {
  appState: AppState;
  logout: () => void;
  
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: "#fff"
    },

    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  link: {
    margin: theme.spacing(1, 1.5),
    marginLeft: "auto"
  },
  logo: {
    width: 60,
    height: "auto",
    marginRight: 10
  },
  appBar: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingLeft: 8
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
    textTransform: "uppercase",
    fontSize: 30,
    color: "#1e3056"
  }
}));

const Header: React.FC<HeaderProps> = props => {
  const classes = useStyles();
  const user = props.appState.user;
  const history = useHistory();
  const {  logout } = props;

 const onLogoutClick = () => {
    
    logout();
    history.push("/login");
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarTitle}>
            <RouterLink to="/" className={classes.brand}>
              <img src="/img/logo_stroke.png" alt="" className={classes.logo} />
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.brandTitle}
              >
                 
              </Typography>
            </RouterLink>
          </div>
          
          {user && user.user && user.user.accessToken ? (
            <Button
              href="#"
              color="primary"
              variant="outlined"
              onClick={onLogoutClick}
              className={classes.link}
            >
              Logout
            </Button>
          ) : (
            <Button
              href="#"
              color="primary"
              variant="outlined"
              onClick={logout}
              className={classes.link}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
