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
import { ConfigurationSchema } from "../ValidationSchema";
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
} from "../styles";
import * as Types from "../../api/definitions";
import { borderRadius } from "react-select/src/theme";

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
interface Total_AnalysisProps {
    AnalyticsList: any;
    Location: any;
    Referral: any;
    onSelectChange: (src: any) => void;
}

const Total_Analytics: React.FC<Total_AnalysisProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    const data = {
        labels: [
            'Accepted & placed',
            'Accepted not placed',
            'Rejected'
        ],
        datasets: [{
            data: [
                props.AnalyticsList.placed ? props.AnalyticsList.placed.count : 0,
                props.AnalyticsList.not_placed ? props.AnalyticsList.not_placed.count : 0,
                props.AnalyticsList.rejected ? props.AnalyticsList.rejected.count : 0
            ],
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
    const [filters, setfilters] = useState({ referral_status: "", referral_source: "", location: "" });

    useEffect(() => {
        props.onSelectChange(filters)
    }, [filters]);
    
    return (
        <div
        //style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px", marginTop: "10px" }}
        >
            {/* <h1 css={subHeading} >Total Referrals</h1> */}
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
                        onChange={(e) => setfilters(prevState => {
                            return { ...prevState, referral_status: e.target.value }
                        })}
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
                        onChange={(e) => setfilters(prevState => {
                            return { ...prevState, referral_source: e.target.value }
                        })}
                    >
                        <option value="">Select</option>
                        {props.Referral.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.value}
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
                        onChange={(e) => setfilters(prevState => {
                            return { ...prevState, location: e.target.value }
                        })}
                    >
                        <option value="">Select</option>
                        {props.Location.map(l => (
                            <option key={l.location} value={l.location_names}>
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
                        <strong>{props.AnalyticsList.total ? props.AnalyticsList.total.count : 0}</strong>
                    </div>
                    <label style={{ marginBottom: "20px" }}>Total Referrals</label>

                </div>
                <div css={twoCol}>

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


                </div>

            </div>

        </div>



    );
};

export default Total_Analytics;
