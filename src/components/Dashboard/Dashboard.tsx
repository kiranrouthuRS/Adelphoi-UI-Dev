/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Market_Analysis from "./Market_Analysis";
import Total_Analytics from "./Total_Analytics";
import OtherParam_Analytics from "./Other_Analytics";
import Allocation_Analytics from "./Allocation_Analytics";
import ProgramAnalytics from "./Program_Analytics";
import Client_Demographics from "./Client_Demographics";
import Occupancy_Analytics from "./Occupancy_Analytics";
import Tool_Analytics from "./Tool_Analytics";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    subHeading,
    label,
    inputField,
    panel,
    panelHeading,
    panelHeader,
    backdrop
} from "../styles";
import * as Types from "../../api/definitions";



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 240,
        width: 100,
    },
    row: {
        height: 540,
        width: 100,
    }
}));


interface DashboardProps {
    Referral: any;
    Analytics: any;
    PCR_analytics: any;
    ROC_analytics: any;
    Replace_analytics: any;
    Stay_analytics: any;
    Occupancy_analytics: any;
    Program_Alloc_List: any;
    Allocation_List: any;
    Market_List: any;
    PerformanceList: any;
    Gender_List: any;
    Age_List: any;
    Demo_List: any;
    ROCCalibrationList: any;
    PCRCalibrationList: any;
    Location: Types.Location[];
    onFormSubmit: (analytics: Types.Analytics) => void;
    totalAnalytics: (filter: any) => void;
    Program_Analytics: (filter: any) => void;
    Other_Analytics: (filter: any, type: any) => void;
    Performance_Analytics: (filter: any) => void;
    Demo_Analytics: (filter: any) => void;
    Calibration_Analytics: (filter: any) => void;
    isLoading: boolean;
    hasError: boolean;
    error: string;
}


const Dashboard: React.FC<DashboardProps> = props => {
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
        per_referral_source: "",
        oth_location: '',
        in_house: '',
        placed: '',
        week: '',
        month: '',
        q: '',
        life_time: '',
        days_count: '30'
    }
    const [filters, setFilters] = useState(initialState);
    const { onFormSubmit, Analytics, Referral, Location, Program_Alloc_List, Market_List } = props;
    const filterAnalytics = async (e) => {
        let filter = initialState
        filter.days_count = e.target.dataset.id
        await setFilters(filter)
        await props.onFormSubmit(filter);
    };
    const Total_HandleChange = async (src) => {
        let filter = filters;

        await setFilters(prevState => {
            return {
                ...prevState, referral_source: src.referral_source,
                referral_status: src.referral_status,
                location: src.location
            }
        });

        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            referral_source: src.referral_source,
            referral_status: src.referral_status,
            location: src.location,
            days_count: filter.days_count
        }
        await props.totalAnalytics(data);

    };

    const Program_HandleChange = async (src) => {
        let filter = filters;
        await setFilters(prevState => {
            return {
                ...prevState, pgm_referral_source: src.referral_source,
                pgm_location: src.location
            }
        });

        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            referral_source: src.referral_source,
            location: src.location,
            days_count: filter.days_count
        }

        await props.Program_Analytics(data);

    };
    const Other_HandleChange = async (src) => {
        let filter = filters;
        await setFilters(prevState => {
            return {
                ...prevState, pgm_referral_source: src.referral_source,
                pgm_location: src.location
            }
        });

        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            referral_source: src.referral_source,
            location: src.location,
            days_count: filter.days_count
        }

        await props.Other_Analytics(data, "others");

    };

    const Occupancy_HandleChange = async (src) => {
        let filter = filters;
        await setFilters(prevState => {
            return {
                ...prevState, pgm_referral_source: src.referral_source,
                pgm_location: src.location
            }
        });

        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            referral_source: src.referral_source,
            location: src.location,
            days_count: filter.days_count
        }

        await props.Other_Analytics(data, "occupancy");

    };
    const Performance_HandleChange = async (src) => {


        let filter = filters;
        filter["per_referral_source"] = src
        await setFilters(prevState => {
            return { ...prevState, per_referral_source: src }
        });


        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            referral_source: filter.per_referral_source,
            days_count: filter.days_count
        }
        await props.Performance_Analytics(data);

    };
    const Demo_HandleChange = async (src) => {


        let filter = filters;
        await setFilters(prevState => {
            return { ...prevState, q: src }
        });


        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            q: src.q,
            days_count: filter.days_count
        }
        await props.Demo_Analytics(data);

    };
    const Calibration_HandleChange = async (src) => {


        let filter = filters;
        await setFilters(prevState => {
            return { ...prevState, q: src }
        });


        let data = {
            start_date: filter.start_date,
            end_date: filter.end_date,
            pcr: src.pcr,
            roc: src.roc,
            days_count: filter.days_count
        }
        await props.Calibration_Analytics(data);

    };
    return (
        <div className={classes.root}>
            <Backdrop css={backdrop} open={props.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                <ErrorMessage component="span" name="start_date" />
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
                                <Link data-name="week" href="#" data-id="7" onClick={filterAnalytics}>Last one week </Link>
                            </Grid>
                            <Grid item xs={4}>
                                <Link data-name="month" href="#" data-id="30" onClick={filterAnalytics}>Last 30 days </Link>
                            </Grid>
                            <Grid item xs={4}>
                                <Link data-name="life_time" href="#" data-id="" onClick={filterAnalytics}>Life time </Link>
                            </Grid>
                        </Grid>

                        <br />

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Total Referrals
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Total_Analytics
                                    AnalyticsList={props.Analytics}
                                    Referral={Referral}
                                    Location={Location}
                                    filter={filters}
                                    onSelectChange={Total_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Program Analytics  – of referrals who are accepted and placed.
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <ProgramAnalytics
                                    ROCList={props.ROC_analytics}
                                    PCRList={props.PCR_analytics}
                                    filter={filters}
                                    Referral={Referral}
                                    Location={Location}
                                    onSelectChange={Program_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Replacement rate and Average Length of stay – of referrals who are accepted and placed.
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <OtherParam_Analytics
                                    Replace_analytics={props.Replace_analytics}
                                    Stay_analytics={props.Stay_analytics}
                                    Occupancy_analytics={props.Occupancy_analytics}
                                    filter={filters}
                                    Referral={Referral}
                                    Location={Location}
                                    onSelectChange={Other_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Occupancy rate – of referrals who are accepted and placed.
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Occupancy_Analytics
                                    Replace_analytics={props.Replace_analytics}
                                    Stay_analytics={props.Stay_analytics}
                                    Occupancy_analytics={props.Occupancy_analytics}
                                    filter={filters}
                                    Referral={Referral}
                                    Location={Location}
                                    onSelectChange={Occupancy_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Program Selection & Allocation Statistics
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Allocation_Analytics
                                    Allocation_List={props.Allocation_List}
                                    Program_Alloc_List={props.Program_Alloc_List}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Market Analysis - Customer Trends – Referral Source Analysis
                                ​</h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Market_Analysis
                                    referralChange={Performance_HandleChange}
                                    Referral={Referral}
                                    marketList={Market_List}
                                    PerformanceList={props.PerformanceList}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    FirstMatch&reg; Prediction Tool Analytics & Calibration
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Tool_Analytics
                                    ROCCalibrationList={props.ROCCalibrationList}
                                    PCRCalibrationList={props.PCRCalibrationList}
                                    onSelectChange={Calibration_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion >
                            <AccordionSummary
                                css={panelHeader}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <h1 css={panelHeading}>
                                    Client Demographics at the Time of Referral - of accepted and placed referrals
                                </h1>
                            </AccordionSummary>
                            <AccordionDetails css={panel}>
                                <Client_Demographics
                                    Gender_List={props.Gender_List}
                                    Age_List={props.Age_List}
                                    Demo_List={props.Demo_List}
                                    onSelectChange={Demo_HandleChange}
                                />
                            </AccordionDetails>
                        </Accordion>


                    </form>
                )}
            </Formik>

            {/* MAIN CONTENT */}
        </div >
    );
};

export default Dashboard;
