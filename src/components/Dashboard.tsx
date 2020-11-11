/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from '@material-ui/core/Box';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import { ConfigurationSchema } from "./ValidationSchema";
import { Pie } from 'react-chartjs-2';
import {
    wrap,
    subHeading,
    selectField,
    fieldRow,
    mainContent,
    twoCol,
    inputField,
    fieldBox,
    txtLabel,
    label
} from "./styles";
import * as Types from "../api/definitions";
import { borderRadius } from "react-select/src/theme";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 140,
        width: 100,
    },
    row: {
        height: 140,
        width: 100,
    }
}));


interface ConfigurationFormProps {
    Referral: Types.Referral[];
    Analytics: any;
    PCR_analytics: any;
    ROC_analytics: any;
    Replace_analytics: any;
    Stay_analytics: any;
    Occupancy_analytics: any;
    Location: Types.Location[];
    onFormSubmit: (analytics: Types.Analytics) => void;
    totalAnalytics: (filter: any) => void;
    Program_Analytics: (filter: any) => void;
    Other_Analytics: (filter: any) => void; 
    isLoading: boolean;
    hasError: boolean;
    error: string;
}


const Dashboard: React.FC<ConfigurationFormProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    const initialState = {
        start_date: '',
        end_date: '',
        referral_status: '',
        referral_source: '',
        location: '',
        pgm_referral_source: '',
        pgm_location: '',
        oth_referral_source: '',
        oth_location: '',
        in_house: '',
        placed: '',
        week: '',
        month: '',
        life_time: '',
        days_count: '2000'
    }
    const [filters, setFilters] = useState(initialState);
    const { onFormSubmit, Analytics, Referral, Location } = props;
    const filterAnalytics = async (e) => {
    let filter = initialState
        filter.days_count = e.target.dataset.id
        setFilters(filter)
        // setFilters(prevState => {
        //     return { ...prevState, days_count: e.target.dataset.id,start_date: "", end_date: "" }
        // });
        await props.onFormSubmit(filter);
    };
    const onChange = async (e) => {
        console.log(e.target.value)
        await setFilters(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        });
    }
    const totalHandleChange = async (e) => {

        let filter = filters
        filter[e.target.name] = e.target.value
        console.log(filter)

        setFilters(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        });
        await props.totalAnalytics(filter);

    };
    const PGM_HandleChange = async (e) => {

        let filter = filters
        filter[e.target.name] = e.target.value
        console.log(filter)

        setFilters(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        });
        await props.Program_Analytics(filter);

    };
    const OTH_HandleChange = async (e) => {

        let filter = filters
        filter[e.target.name] = e.target.value
        console.log(filter)

        setFilters(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        });
        await props.Other_Analytics(filter);

    };
    console.log(props.PCR_analytics)
    
    const program = props.PCR_analytics && props.ROC_analytics ? {
        labels: [
            'Program completed',
            'Remained out of care'
        ],
        datasets: [{
            data: [props.PCR_analytics.pcr ? props.PCR_analytics.pcr.percentage : 0, props.ROC_analytics.roc ? props.ROC_analytics.roc.percentage : 0],
            backgroundColor: [
                '#FF6384',
                '#36A2EB'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
            ]
        }],

    }:[];
    const data = {
        labels: [
            'Accepted & placed',
            'Accepted not placed',
            'Rejected'
        ],
        datasets: [{
            data: [props.Analytics.placed ? props.Analytics.placed.count : 0, props.Analytics.not_placed ? props.Analytics.not_placed.count : 0, props.Analytics.rejected ? props.Analytics.rejected.count : 0],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }],

    };
    

    console.log(filters)
    return (
        <div className={classes.root}>

            <Formik
                initialValues={Types.emptyAnalytics}
                enableReinitialize
                validationSchema=""
                onSubmit={async (values, helpers) => {
                    let filter = initialState
                    filter.start_date = filters.start_date;
                    filter.end_date = filters.end_date;
                    filter.days_count = ""
                    setFilters(filter)
                    await onFormSubmit(filter);
                }}
            >
                {({ values, handleSubmit, handleChange }) => (
                    <form name="configurationForm" onSubmit={handleSubmit}>
                        <Grid item xs={12}>
                            <h2 css={subHeading}>Dashboard</h2>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>


                            <Grid item xs={4}>
                                <label css={label}
                                //style={{ marginTop: 16 }}
                                >
                                    From:
                  </label>

                                <input
                                    type="date"
                                    name="start_date"
                                    css={inputField}
                                    // disabled={Number(values.Program_Completion) === 0}
                                    placeholder=""
                                    value={filters.start_date || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFilters(prevState => {
                                            return { ...prevState, start_date: val }
                                        });
                                        //handleChange(e);
                                    }}
                                />
                                <ErrorMessage component="span" name="end_date" />
                            </Grid>
                            <Grid item xs={4}>
                                <label css={label}
                                // style={{ marginTop: 16 }}
                                >
                                    To:
                  </label>

                                <input
                                    type="date"
                                    name="end_date"
                                    css={inputField}
                                    // disabled={Number(values.Program_Completion) === 0}
                                    placeholder=""
                                    value={filters.end_date || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFilters(prevState => {
                                            return { ...prevState, end_date: val }
                                        });

                                    }}
                                />
                                <ErrorMessage component="span" name="end_date" />
                            </Grid>
                            <Grid item xs={4}>
                                <label css={label}>&nbsp;</label>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                >
                                    Submit
              </Button>
                            </Grid>

                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            <Grid item xs={4}>
                                <Link data-name="week" data-id="7" onClick={filterAnalytics}>Last one week </Link>
                            </Grid>
                            <Grid item xs={4}>
                                <Link data-name="month" data-id="30" onClick={filterAnalytics}>Last 30 days </Link>
                            </Grid>
                            <Grid item xs={4}>
                                <Link data-name="life_time" data-id="2000" onClick={filterAnalytics}>Life time </Link>
                            </Grid>
                        </Grid>
                        <div style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px", marginTop: "10px" }}>
                            <h1 css={subHeading} >Total Referrals</h1>
                            <Grid container spacing={3} >

                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Referral status:
                  </label>

                                    <select
                                        css={selectField}
                                        name="referral_status"
                                        value={filters.referral_status || ""}
                                        onChange={totalHandleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="placed">Accepted &amp; placed</option>
                                        <option value="not_placed">Accepted not placed</option>
                                        <option value="rejected">Rejected</option>

                                    </select>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Referral sources:
                  </label>

                                    <select
                                        css={selectField}
                                        name="referral_source"
                                        value={filters.referral_source || ""}
                                        onChange={totalHandleChange}
                                    >
                                        <option value="">Select</option>
                                        {Referral.map(r => (
                                            <option key={r.referral_code} value={r.referral_code}>
                                                {r.referral_name}
                                            </option>
                                        ))}
                                    </select>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Locations:
                  </label>

                                    <select
                                        css={selectField}
                                        name="location"
                                        value={filters.location || ""}
                                        onChange={totalHandleChange}
                                    >
                                        <option value="">Select</option>
                                        {Location.map(l => (
                                            <option key={l.location} value={l.location}>
                                                {l.location_names}
                                            </option>
                                        ))}

                                    </select>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        // padding: "20px",
                                        // marginBottom: "10px"

                                    }} >
                                        <strong>{props.Analytics.total ? props.Analytics.total.count : 0}</strong>
                                    </div>
                                    <span style={{ marginBottom: "20px" }}>Total Referrals</span>

                                </Grid>
                                <Grid item xs={6}>

                                    <Pie data={data}
                                        options={{
                                            legend: {
                                                display: true,
                                                position: 'right',
                                                labels: {
                                                    fontColor: 'black',
                                                    boxWidth: 15,
                                                }

                                            },

                                            plugins: {
                                                datalabels: {
                                                    formatter: (data) => {

                                                        return data;


                                                    },
                                                    color: 'black',
                                                }
                                            }
                                        }}
                                    />


                                </Grid>

                            </Grid>

                        </div>
                        <div style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}>
                            <h1 css={subHeading} >Program Analytics  – of referrals who are accepted and placed.​</h1>
                            <Grid container spacing={3} >
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Referral sources:
                  </label>

                                    <select
                                        css={selectField}
                                        name="pgm_referral_source"
                                        value={filters.pgm_referral_source || ""}
                                        onChange={PGM_HandleChange} 
                                    >
                                        <option value="">Select</option>
                                        {Referral.map(r => (
                                            <option key={r.referral_code} value={r.referral_code}>
                                                {r.referral_name}
                                            </option>
                                        ))}
                                    </select>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Locations:
                  </label>

                                    <select
                                        css={selectField}
                                        name="pgm_location"
                                        value={filters.pgm_location || ""}
                                        onChange={PGM_HandleChange}
                                    >
                                        <option value="">Select</option>
                                        {Location.map(l => (
                                            <option key={l.location} value={l.location}>
                                                {l.location_names}
                                            </option>
                                        ))}

                                    </select>

                                </Grid>
                            </Grid>
                            <Grid container spacing={3} >
                                <Grid item xs={3}>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        //padding: "20px",
                                        //marginBottom: "10px"

                                    }} >
                                        <strong> {props.PCR_analytics.pcr ? props.PCR_analytics.pcr.count : 0}</strong>

                                    </div>
                                        Program completion rate

                                </Grid>
                                <Grid item xs={3}>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        //padding: "20px",
                                        //marginBottom: "10px"

                                    }} >
                                        <strong> {props.ROC_analytics.roc ? props.ROC_analytics.roc.count : 0}</strong>

                                    </div>
    Remain out of care

</Grid>
                                <Grid item xs={6}>

                                    <Pie data={program}
                                        options={{
                                            legend: {
                                                display: true,
                                                position: 'right',
                                                labels: {
                                                    fontColor: 'black',
                                                    boxWidth: 15,
                                                }

                                            },

                                            plugins: {
                                                datalabels: {
                                                    formatter: (data) => {

                                                        return data;


                                                    },
                                                    color: 'black',
                                                }
                                            }
                                        }}
                                    />


                                </Grid>

                            </Grid>

                        </div>
                        <div style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}>
                            <h1 css={subHeading} >Other Parameters – of referrals who are accepted and placed.​</h1>
                            <Grid container spacing={3} >
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Referral sources:
                  </label>

                                    <select
                                        css={selectField}
                                        name="oth_referral_source"
                                        value={filters.oth_referral_source || ""}
                                        onChange={OTH_HandleChange}
                                    >
                                        <option value="">Select</option>
                                        {Referral.map(r => (
                                            <option key={r.referral_code} value={r.referral_code}>
                                                {r.referral_name}
                                            </option>
                                        ))}
                                    </select>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        Locations:
                  </label>

                                    <select
                                        css={selectField}
                                        name="oth_location"
                                        value={filters.oth_location || ""}
                                        onChange={OTH_HandleChange}
                                    >
                                        <option value="">Select</option>
                                        {Location.map(l => (
                                            <option key={l.location} value={l.location}>
                                                {l.location_names}
                                            </option>
                                        ))}

                                    </select>
                                </Grid>
                            </Grid>
                            
                            <div css={fieldRow} style={{ justifyContent: "center", marginTop: "10px" }}>
                                <div css={twoCol}>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        // padding: "20px",
                                        // marginBottom: "10px"

                                    }} >
                                        <strong> {props.Replace_analytics.replacement_rate?props.Replace_analytics.replacement_rate:0}</strong>
                                    </div>
Replacement rate

                                </div>
                                <div css={twoCol}>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        //padding: "20px",
                                        //marginBottom: "10px"

                                    }} >
                                        <strong> {props.Stay_analytics.avg_length_of_stay ? props.Stay_analytics.avg_length_of_stay : 0}</strong>
                                    </div>
                                        Average Length of stay

                                </div>
                                <div css={twoCol}>

                                    <div style={{
                                        background: "#36A2EB",
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        // padding: "20px",
                                        // marginBottom: "10px"

                                    }} >
                                        <strong>
                                            {props.Occupancy_analytics.occupancy_rate ? props.Occupancy_analytics.occupancy_rate : 0 }
                                        </strong>
                                    </div>
Occupancy rate

                                </div>

                            </div>

                        </div>
                    </form>
                )}
            </Formik>

            {/* MAIN CONTENT */}
        </div >
    );
};

export default Dashboard;
