/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux"
import { AppState } from "../redux-modules/root";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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
} from "./styles";
import * as Types from "../api/definitions";

export interface UsersListState {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email_id: string;
  mobile: string;
  gender: string;
  role_type: string;
  role_type_text: string;
  isEdit: boolean;
  message: string;
  accessToken: string[];
  isLoading: boolean;
  adminList: string[];
  isOpen: boolean;
  adminEmail: string;
  alertUser: boolean;
}

export interface UsersListProps {
  usersList: Types.Users[];
  availableUsersList: Types.Users[];
  rolesList: Types.Users[];
  isLoading: boolean;
  user: any;
  headerColor: string;
  createUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  updateUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  deleteUsers: (users: Types.Users,is_accessToken:any) => Promise<void>;
  getAvailableUsers: (users: Types.Users) => Promise<void>;
  getRoles: (is_accessToken:any) => Promise<void>;  
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
export class UsersList extends React.Component<
  UsersListProps,
  UsersListState
  >
{ 
  constructor(props: UsersListProps) {
    super(props);

    this.state = {
      id: "",
      full_name: "",
      first_name: "",
      last_name: "",
      email_id: "",
      mobile: "",
      gender: "",
      role_type: "",
      role_type_text: "",
      isEdit: false,
      message: "",
      accessToken: [],
      adminList:[],
      isLoading: this.props.isLoading,
      isOpen: false,
      adminEmail: "",
      alertUser: false
    
    };
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    const isEdit:any = this.state.isEdit
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    const users: Types.Users = {
      id: isEdit ? this.props.availableUsersList[0].id : "",
      full_name: "",
      name: "",
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email_id: this.state.email_id,
      mobile: this.state.mobile,
      gender: this.state.gender,
      role_type: this.state.role_type
    };
    if (isEdit) {
      this.setState({ isLoading: true });
     const response: any = await this.props.updateUsers(users,is_accessToken); 
     let message = response.status === "failed" && typeof response.message === "object" ? Object.keys(response.message).map(msg=>response.message[msg]) : ""
     this.setState({
        message: response.status === "failed" ? message ? (message.toString()).replace(/,/g, "  ") : response.message : "User updated successfully",
        isEdit : false
      });
     
    } else {
      const response: any =  await this.props.createUsers(users,is_accessToken);
      let message = response.status === "failed" && typeof response.message === "object" ? Object.keys(response.message).map(msg=>response.message[msg]) : ""
      console.log((message.toString()).replace(/,/g, "</br>"))
      this.setState({
        message: response.status === "failed" ? message ? (message.toString()).replace(/,/g, "  ") : response.message : "User created successfully"
      })
      
    }
    this.setState({ isLoading: false });
    this.setState({
      id: "",
      full_name: "",
      first_name: "",
      last_name: "",
      email_id: "",
      mobile: "",
      gender: "",
      role_type: "",
      role_type_text: "",
      isEdit: false,
      adminList: []

    })

  }
  
  handleChangeFirst = (e: any) => {

    this.setState({
      first_name: e.target.value
    });
  }

  handleChangeLast = (e: any) => {

    this.setState({
      last_name: e.target.value
    });
  }
  handleChangeEmail = (e: any) => {

    this.setState({
      email_id: e.target.value
    });
  }
  handleChangePhone = (e: any) => {

    this.setState({
      mobile: e.target.value
    });
  }
  handleChangeGender = (e: any) => {

    this.setState({
      gender: e.target.value
    });
  }
  handleChangeRole = (e: any) => {

    this.setState({
      role_type: e.target.value
    });
  }
  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }
  handleEdit = async (e: any) => {
    e.preventDefault();
    this.setState({
      message: ""
    })
    let userID: any = this.state.id;
    if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
      userID = e.currentTarget.dataset.id;
    }
    this.setState({ isLoading: true });
    await this.props.getAvailableUsers(userID) 
    const singleuser = (this.props.availableUsersList && this.props.availableUsersList) || [];
    const singlerole = (this.props.rolesList && this.props.rolesList) || [];
    const roleID: any = singlerole.filter(id => id.name === singleuser[0].role_type)
     this.setState({
      id: singleuser[0].id,
      full_name: "",
      first_name: singleuser[0].first_name,
      last_name: singleuser[0].last_name?singleuser[0].last_name:"", 
      email_id: singleuser[0].email_id,
      mobile: singleuser[0].mobile,
      gender: singleuser[0].gender?.toString(),  
      role_type: roleID[0]?.id, 
      role_type_text: singleuser[0].role_type,
      isEdit: true
    });
    this.setState({ isLoading: false });
    window.scrollTo(0, 0);
  }
  alertDelete = async (e: any) => {
    e.preventDefault();
    let userID: any = this.state.id;
    let adminEmail: any = this.state.adminEmail;
    if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
      userID = e.currentTarget.dataset.id;
      this.setState({id: userID})
    }
    const data: any = {
           id: userID,
           adminEmail: adminEmail

    }
    this.setState({
      alertUser: true,
      isOpen: true
    })
  }

  handleDelete = async (e: any) => {
    e.preventDefault();
    let userID: any = this.state.id;
    let adminEmail: any = this.state.adminEmail;
    if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
      userID = e.currentTarget.dataset.id;
      this.setState({id: userID})
    }
    const data: any = {
           id: userID,
           adminEmail: adminEmail

    }
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken
    this.setState({ isLoading: true });
    const response: any =  await this.props.deleteUsers(data,is_accessToken)
    this.setState({ isLoading: false });
    if(response.message === "select any one to make default"){
          this.setState({adminList: response.response, isOpen: true})
    }else{
    this.setState({
      message: response.message,
      isOpen: false
    })
  }
  }

  render() {
    const { usersList, rolesList, user } = this.props;
    let user_role = user.user.role_type
    const isEdit = this.state.isEdit
    console.log(this.state)
    return (
      <form name="UsersForm" onSubmit={this.handleSubmit}>
        <Backdrop css={backdrop} open={this.props.isLoading || this.state.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        <h1 css={subHeading}  style= {{color: this.props.headerColor}}>{isEdit ? "Edit User" : "Add New User"}</h1>
        <div css={fieldRow}>
          <div css={twoCol}>
            <label css={label}>First Name</label>
            <input
              type="text"
              name="first_name"
              css={inputField}
              placeholder=""
              value={this.state.first_name}
              onChange={this.handleChangeFirst}
              required
            />
            {/* <ErrorMessage component="span" name="first_name" /> */}
          </div>
          <div css={twoCol}>
            <label css={label}>Last Name</label>
            <input
              type="text"
              name="last_name"
              css={inputField}
              placeholder=""
              value={this.state.last_name}
              onChange={this.handleChangeLast}
              required
            />
            {/* <ErrorMessage component="span" name="last_name" /> */}
          </div>
        </div>
        <div css={fieldRow}>
          <div css={twoCol}>
            <label css={label}>Email ID</label>
            <input
              type="text"
              name="email_id"
              css={inputField}
              placeholder=""
              value={this.state.email_id}
              onChange={this.handleChangeEmail}
            />
            {/* <ErrorMessage component="span" name="email_id" /> */}
          </div>
          <div css={twoCol}>
            <label css={label}>Phone Number</label>
            <input
              type="text"
              name="mobile"
              css={inputField}
              placeholder=""
              value={this.state.mobile}
              onChange={this.handleChangePhone}
            />
            {/* <ErrorMessage component="span" name="mobile" /> */}
          </div>
        </div>
        <div css={fieldRow}>
          <div css={twoCol}>
            <label css={label}>Sex</label>
            <div
              css={fieldBox}
              style={{ width: "47.8%", display: "inline-block" }}
            >

              <input
                type="radio"
                onChange={this.handleChangeGender}
                name="gender"
                id="female"
                value="1"
                required
                checked={this.state.gender === "1"}
              />{" "}
              <label htmlFor="female">Female</label>
            </div>
            <div
              css={fieldBox}
              style={{ width: "47.8%", display: "inline-block" }}
            >
              <input
                type="radio"
                onChange={this.handleChangeGender}
                name="gender"
                id="male"
                value="2"
                required
                checked={this.state.gender === "2"}
              />{" "}
              <label htmlFor="male">Male</label>
            </div>

          </div>
          <div css={twoCol}>
            <label css={label}>Role</label>
            <select
              css={selectField}
              name="role_type"
              id="role_type"
              value={this.state.role_type || ""}
              onChange={this.handleChangeRole}
            >
              <option value="" >Select</option>
               
              { Array.isArray(rolesList) ? rolesList  &&  rolesList.map((role, key) =>
                <option value={role.id} key={key}>{role.name}

                </option>) : ""} 
            </select>

          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            &nbsp;
        </Grid>
          <Grid item xs={6}>
            <Box color="#4caf50" fontWeight="fontWeightBold">{this.state.message} </Box>
          </Grid>
          <Grid item xs={4} >

            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ marginRight: 10, 
                backgroundColor: this.props.headerColor,
                color: "#fff" }}
            >
              {isEdit ? "Update User" : "ADD USER"}
            </Button>

          </Grid>
        </Grid>
        <div css={fieldRow}></div>
        <Table aria-label="users table" css={dataTable}>
          <TableHead>
            <TableRow css={tableHeader}>
              <TableCell >
                Name
                      </TableCell>
              <TableCell >
                Email ID
                      </TableCell>
              <TableCell >
                Role
                      </TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.length > 0 ? (
              usersList.map((p, id) => (
                <TableRow key={id} css={tableRow}>
                  <TableCell>{p.full_name}</TableCell>  
                  <TableCell>{p.email_id}</TableCell>
                  <TableCell>{p.role_type}</TableCell>
                  <TableCell>
                  {(  user_role === "Coordinator" ? "-" :
              user_role === "Admin" && (p.role_type === "Super Admin" || p.role_type === "Admin" )) ? "-" :
              <a href="" data-id={p.id} onClick={this.handleEdit}>Edit</a>
                                }
                   
                  </TableCell>
                  <TableCell>
                  {(  user_role === "Coordinator" ? "-" :
              user_role === "Admin" && (p.role_type === "Super Admin" || p.role_type === "Admin" )) ? "-" : 
              <a href="" data-id={p.id} onClick={this.alertDelete}>Delete</a>
                                } 
                   
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow key={9999}>
                  <TableCell colSpan={2} >
                    &nbsp;
                        </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <Modal
            isOpen={this.state.isOpen}
            ariaHideApp={false}
            onRequestClose={this.handleClose}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {this.state.alertUser ? (
              <React.Fragment>
              <h1 css={subHeading} style={{ color: this.props.headerColor }}>Are you sure to delete this User.</h1>
              <Grid container spacing={3}>
              <Grid item xs={2} >&nbsp; </Grid>
              <Grid item xs={4} >

            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ marginRight: 10, 
                backgroundColor: this.props.headerColor,
                color: "#fff" }}
              onClick = {this.handleDelete}
            >
              Yes
            </Button>

          </Grid>
          <Grid item xs={4} >

          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            style={{ marginRight: 10, 
              backgroundColor: this.props.headerColor,
              color: "#fff" }}
            onClick = {(e) => this.setState({isOpen: false, alertUser: false})}
          >
            No
          </Button>

        </Grid>
        <Grid item xs={2} >&nbsp; </Grid>
        </Grid> 
        </React.Fragment>
            ) : (
              <React.Fragment>
            <div>
              <h1 css={subHeading} style={{ color: this.props.headerColor }}>Please choose one of the below to be a default SUPER ADMIN​</h1>
              
              {this.state.adminList.map(list => (
                <div css={fieldRow}>
                  <div
                  css={fieldBox}
                  style={{ width: "47.8%", display: "inline-block" }}
                >
    
                  <input
                    type="radio"
                    onChange={(e) => this.setState({adminEmail: e.target.value})}
                    name="adminemail"
                    id="adminemail"
                    value={list}
                    required
                    checked={this.state.adminEmail === list}
                  />{" "}
                  <label htmlFor="adminemail">{list}</label>
                </div>
                </div> 
              ) )}
              
            </div>
            <Grid item xs={4} >

            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ marginRight: 10, 
                backgroundColor: this.props.headerColor,
                color: "#fff" }}
              onClick = {this.handleDelete}
            >
              Delete USER
            </Button>

          </Grid>
          </React.Fragment>
          )}
          </Modal>
      </form>
    );
  }
}
const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    appState: state
  };
};
export default connect(mapStateToProps)(UsersList);
