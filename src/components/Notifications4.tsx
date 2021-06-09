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
import DateFnsUtils from "@date-io/date-fns";
// import { format } from "date-fns";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
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
import * as Types from "../api/definitions";



interface Notification4Props {
    Notification_data: any;
    onSearch: (Type:any, start_date: any, end_date: any) => void;
    downloadReport: (Type: any, start_date: any, end_date: any) => void;
    isLoading: boolean;
    error: string;
    // isLoading: boolean;
    // hasError: boolean;
    // error: string;

}

interface FormValues {
    start_date: any;
    end_date: any;

}
const Notifications4: React.FC<Notification4Props> = props => {
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
                    await props.onSearch("roc", sd, ed);

                }}
            >
                {({ values, handleSubmit, handleChange, setFieldValue }) => (

                    <form name="UsersForm" onSubmit={handleSubmit}>
                         <h1 css={subHeading}>Clients without Remained-Out-of-Care Outcomes, Post one year from their End Date:</h1>
                        <div css={fieldRow}>
                            <div css={twoCol}>
                                <label css={label}>End Date From</label>
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
                                    color="primary"
                                    style={{ marginRight: 10 }}
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
                           <Table aria-label="users table" css={dataTable}>

                                <TableHead>
                                    <TableRow css={tableHeader}>
                                        <TableCell >
                                            Client ID
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
                                        <TableCell >
                                            Location
                      </TableCell>
                                        <TableCell >
                                            Program Completion
                      </TableCell>
                                        <TableCell >
                                            End Date
                      </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.Notification_data.length > 0 ? (
                                        props.Notification_data.map((p: any, id) => (
                                            <TableRow key={id} css={tableRow} >
                                                <TableCell >{p["Client Code"]}</TableCell>
                                                <TableCell>{p["First Name"]} </TableCell>
                                                <TableCell>{p["Last Name"]} </TableCell>
                                                <TableCell>{p["Referral Source"]} </TableCell>
                                                <TableCell>{p.client_selected_locations} </TableCell>
                                                <TableCell>{p.Program_Completion} </TableCell>
                                                <TableCell>{format(new Date(p.end_date), "MM-dd-yyyy")} </TableCell>
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
                                    onClick={() => props.downloadReport("roc", startdate, enddate)}
                                >
                                    Download Report
                </Button>



                            </div>

                        </React.Fragment>
                        :
                        <Table aria-label="users table" css={dataTable}>
                            <TableHead>
                               </TableHead>
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

export default Notifications4;