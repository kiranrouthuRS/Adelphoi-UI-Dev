/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { RouteComponentProps } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
    subHeading,
    fieldRow,
    twoCol,
    inputField,
    tableHeader,
    tableRow,
    dataTable,
    label,
   } from "./styles";
import * as Types from "../api/definitions";
import { domainPath } from "../App"

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

export interface NotificationsState {
    customer: string;
    startDate: string;
    endDate: string;
    sDate: string;
    eDate: string;
    base_fare: string;
    billing_cycle: string;
    other_fare: string;
    error: string;
    allRecords: string[];
    singlerecord: any;
    amount: string;
    started_on: string;
    completed_on: string;
    order_id: string;
    onRangeRecord: boolean;
    record_ID: string;
    

}
interface MatchParams {
    index: string;
  }
interface MatchProps extends RouteComponentProps<MatchParams> {}
export interface NotificationsProps {
    Notification_data: any,
// isOpen: boolean

}


class Notifications2 extends React.Component<
    NotificationsProps,
    NotificationsState
    >
{
    constructor(props: NotificationsProps) {
        super(props);

        this.state = {
            customer: "",
            startDate: "",
            endDate: "",
            sDate: "",
            eDate: "",
            base_fare: "",
            billing_cycle: "",
            other_fare: "",
            error: "",
            allRecords: [],
            singlerecord: [],
            amount: '',
            started_on: '',
            completed_on: '',
            order_id:'',
            onRangeRecord: false,
            record_ID:"",
           

        };
    }

     setStartDate = (date: any) => {
        let event = new Date(date);
        let year = event.getFullYear();
        let month = 1 + (event.getMonth())
        let datee = event.getDate();
        let date1 = [year, month, datee].join("-")
        this.setState({ startDate: date, sDate: date1 })
    }

    setEndDate = (date: any) => {
        let event = new Date(date);
        let year = event.getFullYear();
        let month = 1 + (event.getMonth())
        let datee = event.getDate();
        let date1 = [year, month, datee].join("-")
        this.setState({ endDate: date, eDate: date1 })
    }

    onLoad = async (e: any) => {
        e.preventDefault();
        const { sDate, eDate } = this.state;
        // const response = await fetchAllRecords(sDate, eDate, this.props.accessToken);
        // this.setState({
        //     allRecords: response.response,
        //     onRangeRecord: true,
        //     singlerecord: []
        // })
    }
     
    singleRecord = async (e: any) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id
        // const response = await getRecord(id,this.props.accessToken);
        // const data = response.response
        // this.setState({
        //     singlerecord: data.order_reports,
        //     amount: data.amount,
        //     started_on: data.started_on,
        //     completed_on: data.completed_on,
        //     order_id: data.id,
        //     allRecords: [],
        //     onRangeRecord:false,
        //     record_ID: id
        // })
    }
         
    // downloadAllRecords=async(e)=>{
    //     const res = await downloadRecords(this.props.accessToken); 
    //     const path = res.response
        
    // }

    // downloadOrder=async(e)=>{
    //     const { sDate, eDate } = this.state;
    //    const res = await getOrderDownload(sDate, eDate, this.props.accessToken);
       
    // }

    // downloadReport=async(e)=>{
    //     const id = e.currentTarget.dataset.id
    //    const res = await downloadReportCSV(id, this.props.accessToken ); 
    //    const path = res.response
       
       
    // }

    render() {
        const { base_fare, billing_cycle, other_fare, } = this.state;
        const allRecords = (this.state.allRecords && this.state.allRecords) || [];
        if(this.state.error){
            return(<div>{this.state.error}</div>);
        }else{
            return (
                <React.Fragment>
                <form name="UsersForm" >
                    <h1 css={subHeading}>Pending:</h1>
                    
                    <div css={fieldRow}> 
                        <div css={twoCol}>
                            <label css={label}>From</label>
                            <DatePicker
                                css={inputField}
                                selected={this.state.startDate}
                                onChange={date => this.setStartDate(date)}
                                placeholderText={'mm/dd/yyyy'}
                                showYearDropdown
                                scrollableYearDropdown
                            />
                        </div>
                        <div css={twoCol}>
                            <label css={label}>To</label>
                            <DatePicker
                                css={inputField}
                                selected={this.state.endDate}
                                onChange={date => this.setEndDate(date)}
                                placeholderText={'mm/dd/yyyy'}
                                showYearDropdown
                                scrollableYearDropdown
                            />
                        </div>
                        <div css={twoCol}>
                            <label css={label}>&nbsp;</label>
                            <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 10 }}
                                onClick={this.onLoad}
                            >
                                Search
                </Button>
                        </div>
                    </div>
    
                    <div css={fieldRow}></div>
                   
                </form>
                {this.props.Notification_data.length > 0 ?
               <React.Fragment> 
                   <p>Order report for {domainPath}. {this.state.started_on.slice(0, 10)} to 
                   {this.state.completed_on.slice(0, 10)}. Order ID - {this.state.order_id}</p>
                <Table aria-label="users table" css={dataTable}>
                   
                    <TableHead>
                        <TableRow css={tableHeader}>
                            <TableCell >
                                Client ID
                      </TableCell>
                            <TableCell >
                            Date of Referral
                      </TableCell>
                            <TableCell >
                            First Name
                      </TableCell>
                            <TableCell >
                            Last Name
                      </TableCell>
                      <TableCell >
                      Referral Source
                      </TableCell>
                
                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {this.props.Notification_data.length > 0 ? (
                            this.props.Notification_data.map((p: any, id) => (
                                <TableRow key={id} css={tableRow} >
                                    <TableCell >{p["Client Code"]}</TableCell>
                                    <TableCell>{p["Date of Referral"]} </TableCell>
                                    <TableCell>{p["First Name"]} </TableCell>
                                    <TableCell>{p["Last Name"]} </TableCell>
                                    <TableCell>{p["Referral Source"]} </TableCell>
                                </TableRow>
                            ))
                             
                        ) 
                        
                        : (
                                <TableRow key={9999}>
                                    <TableCell colSpan={2} >
                                        No records were found.
                        </TableCell>
                                </TableRow>
                            )}
                           
                    </TableBody>
                </Table>
                <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                            <label css={label}>&nbsp;</label>
                           <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 10, marginTop: 10 }}
                                // onClick={this.downloadOrder}
                            >
                              Download Report
                </Button> 
               
        
                  
                        </div>
                </React.Fragment>
                    :
                    <Table aria-label="users table" css={dataTable}>
                       <TableBody>
                        <TableRow key={9999}>
                                    <TableCell colSpan={2} >
                                        No records were found.
                        </TableCell>
                                </TableRow>
                                
                        </TableBody>
                    </Table>

                }
                
                        
                </React.Fragment> 
            );
        }
    
    }
}

export default Notifications2;