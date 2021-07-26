/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Formik, FormikProps, FormikErrors, FieldProps, Field, ErrorMessage } from "formik";
import { format } from "date-fns";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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
    backdrop
} from "./styles";




interface Notification2Props {
    Notification_data: any;
    onSearch: (Type: any, start_date: any, end_date: any) => void;
    downloadReport: (Type: any, start_date: any, end_date: any) => void;
    isLoading: boolean;
    error: string;
    headerColor: string;
    
}

interface FormValues {
    start_date: any;
    end_date: any;

}
const Notifications2: React.FC<Notification2Props> = props => {
     const [startdate, setStartDate] = useState<string | null>(null);
    const [enddate, setEndDate] = useState<string | null>(null);
    const getInitialValues = (): FormValues => {
        let start_date: any = null;
        let end_date: any = null;
        return {
            start_date: start_date || "",
            end_date: end_date || ""
        };
    };
    return (
        <React.Fragment>
            <Formik
                initialValues={getInitialValues()}
                validate={values => {
                    const errors: FormikErrors<FormValues> = {};
                    if (!values.start_date) {
                        errors.start_date = "Required";
                    }
                    if (!values.end_date) {
                        errors.end_date = "Required";
                    }
                    return errors;
                }}
                enableReinitialize
                onSubmit={async values => {
                    const sd = values.start_date
                        ? format(new Date(values.start_date), "yyyy-MM-dd")
                        : "";
                    const ed = values.end_date
                        ? format(new Date(values.end_date), "yyyy-MM-dd")
                        : "";
                    await props.onSearch("pending", sd, ed);

                }}
            >
                {({ values, handleSubmit, handleChange, setFieldValue }) => (

                    <form name="UsersForm" onSubmit={handleSubmit}>
                        <h1 css={subHeading} style= {{color: props.headerColor}}>Pending Clients:</h1>
                        <div css={fieldRow}>
                            <div css={twoCol}>
                                <label css={label}>Date of Referral From</label>
                                <DatePicker
                                    css={inputField}
                                    name="start_date"
                                    selected={values.start_date}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setFieldValue('start_date', date)
                                    }}
                                    placeholderText={'mm/dd/yyyy'}
                                    showYearDropdown
                                    scrollableYearDropdown
                                />
                                <ErrorMessage
                                    component="span"
                                    name="start_date"
                                />
                            </div>
                            <div css={twoCol}>
                                <label css={label}>To</label>
                                <DatePicker
                                    css={inputField}
                                    name="end_date"
                                    selected={values.end_date}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setFieldValue('end_date', date)
                                    }}
                                    placeholderText={'mm/dd/yyyy'}
                                    showYearDropdown
                                    scrollableYearDropdown
                                />
                                <ErrorMessage
                                    component="span"
                                    name="end_date"
                                />
                            </div>
                            <div css={twoCol}>
                                <label css={label}>&nbsp;</label>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    style={{ marginRight: 10, 
                                        backgroundColor: props.headerColor,
                                        color: "#fff" }}
                                // onClick={this.onLoad}
                                >
                                    Search
                </Button>
                            </div>
                        </div>

                        <div css={fieldRow}></div>

                    </form>

                )}
            </Formik>
            <Backdrop css={backdrop} open={props.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {props.Notification_data.length > 0 ?
                <React.Fragment>
                    {/* <p>Order report for {domainPath}. {thistate.started_on.slice(0, 10)} to
           {this.state.completed_on.slice(0, 10)}. Order ID - {this.state.order_id}</p> */}
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
                            {props.Notification_data.length > 0 ? (
                                props.Notification_data.map((p: any, id) => (
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
                            style={{ marginRight: 10, marginTop: 10,
                                backgroundColor: props.headerColor,
                                color: "#fff" }}
                          onClick={() => props.downloadReport("pending", startdate, enddate)}
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

export default Notifications2;