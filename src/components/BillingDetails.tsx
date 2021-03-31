/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { AppState } from "../redux-modules/root";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { fetchBillingStatus, fetchAllRecords, 
        getRecord, downloadRecords,getOrderDownload,downloadReportCSV } from "../api/api";
import {
    wrap,
    subHeading,
    fieldRow,
    fieldBox,
    mainContent,
    twoCol,
    inputField,
    tableHeader,
    tableRow,
    dataTable,
    backdrop,
    label,
    selectField
} from "./styles";
import * as Types from "../api/definitions";
import { domainPath } from "../App"

export interface BillingDetailsState {
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
export interface BillingDetailsProps {
accessToken: any

}


class BillingDetails extends React.Component<
    BillingDetailsProps,
    BillingDetailsState
    >
{
    constructor(props: BillingDetailsProps) {
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
            record_ID:""

        };
    }

    async componentDidMount() {
        const response = await fetchBillingStatus(this.props.accessToken)
        if (response.status === "failed") { 
            this.setState({
                error: response.message
            })
        } else {
            this.setState({
                base_fare: response.response[0].base_fare,
                billing_cycle: response.response[0].billing_cycle,
                other_fare: response.response[0].other_fare_per_cycle
            })
        }

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
        const response = await fetchAllRecords(sDate, eDate, this.props.accessToken);
        this.setState({
            allRecords: response.response,
            onRangeRecord: true,
            singlerecord: []
        })
    }

    singleRecord = async (e: any) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id
        const response = await getRecord(id,this.props.accessToken);
        const data = response.response
        this.setState({
            singlerecord: data.order_reports,
            amount: data.amount,
            started_on: data.started_on,
            completed_on: data.completed_on,
            order_id: data.id,
            allRecords: [],
            onRangeRecord:false,
            record_ID: id
        })
    }
         
    downloadAllRecords=async(e)=>{
        const res = await downloadRecords(this.props.accessToken); 
        const path = res.response
        
    }

    downloadOrder=async(e)=>{
        const { sDate, eDate } = this.state;
       const res = await getOrderDownload(sDate, eDate, this.props.accessToken);
       
    }

    downloadReport=async(e)=>{
        const id = e.currentTarget.dataset.id
       const res = await downloadReportCSV(id, this.props.accessToken ); 
       const path = res.response
       
       
    }

    render() {
        const { base_fare, billing_cycle, other_fare, } = this.state;
        const allRecords = (this.state.allRecords && this.state.allRecords) || [];
        if(this.state.error){
            return(<div>{this.state.error}</div>);
        }else{
            return (
                <React.Fragment>
                <form name="UsersForm" >
                    <h1 css={subHeading}>Order Reports</h1>
                    <p>Billing cycle – <strong>{billing_cycle}</strong>, base fare <b>${base_fare}</b> other charges - <b>${other_fare}​</b></p>
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
                                Load
                </Button>
                        </div>
                    </div>
    
                    <div css={fieldRow}></div>
                   
                </form>
                {this.state.singlerecord.length > 0 ?
               <React.Fragment> 
                   <p>Order report for {domainPath}. {this.state.started_on.slice(0, 10)} to 
                   {this.state.completed_on.slice(0, 10)}. Order ID - {this.state.order_id}</p>
                <Table aria-label="users table" css={dataTable}>
                   
                    <TableHead>
                        <TableRow css={tableHeader}>
                            <TableCell >
                                Time Stamp
                      </TableCell>
                            <TableCell >
                                Report ID
                      </TableCell>
                            <TableCell >
                                Client Code
                      </TableCell>
                            <TableCell >
                                Referral Source
                      </TableCell>
                      <TableCell >
                                Amount
                      </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {this.state.singlerecord.length > 0 ? (
                            this.state.singlerecord.map((p: any, id) => (
                                <TableRow key={id} css={tableRow} >
                                    <TableCell >{p.date_created}</TableCell>
                                    <TableCell>{p.report_id} </TableCell>
                                    <TableCell>{p.client_code} </TableCell>
                                    <TableCell>{p.referral_source} </TableCell>
                                    <TableCell>{p.amount} </TableCell>
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
                            <TableRow key={9998}>
                                    <TableCell colSpan={2} >
                                    Total amount
                                     </TableCell>
                                     <TableCell colSpan={2} >
                                       ${this.state.amount}
                                     </TableCell>
                                     <TableCell colSpan={2} >
                                       &nbsp;
                                     </TableCell>
                                     <TableCell colSpan={2} >
                                       &nbsp;
                                     </TableCell>
                                </TableRow>
                    </TableBody>
                </Table>
                </React.Fragment>
                    :
                    <Table aria-label="users table" css={dataTable}>
                        <TableHead>
                            <TableRow css={tableHeader}>
                                <TableCell >
                                    Order ID
                      </TableCell>
                                <TableCell >
                                    Billing period
                      </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allRecords.length > 0 ? (
                                allRecords.map((p: any, id) => (
                                    <TableRow key={id} css={tableRow} data-id={p.id} onClick={this.singleRecord}>
                                        <TableCell >{p.id}</TableCell>
                                        <TableCell>{p.started_on.slice(0, 10)} to {p.completed_on.slice(0, 10)}</TableCell>
                                    </TableRow>
                                ))

                            ) : (
                                    <TableRow key={9999}>
                                        <TableCell colSpan={2} >
                                            No records were found.
                        </TableCell>
                                    </TableRow>
                                )}
                                
                        </TableBody>
                    </Table>

                }
                 <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                            <label css={label}>&nbsp;</label>
                           {this.state.onRangeRecord ?
                           <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 10, marginTop: 10 }}
                                onClick={this.downloadOrder}
                            >
                              Download CSV
                </Button> 
                : this.state.started_on ? 
                <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                color="primary"
                                data-id={this.state.record_ID}
                                style={{ marginRight: 10, marginTop: 10 }}
                                onClick={this.downloadReport}
                            >
                              Download CSV
                </Button>
                : 
                <Button
                                type="submit"
                                size="large"
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 10, marginTop: 10 }}
                                onClick={this.downloadAllRecords}
                            >
                              Download all order reports
                </Button>
        }
                  
                        </div>
                </React.Fragment> 
            );
        }
    
    }
}
const mapStateToProps = (state: AppState) => { 
    return {
      user: state.user,
      
    };
  };
export default connect(
    mapStateToProps,
    null
  )(BillingDetails);