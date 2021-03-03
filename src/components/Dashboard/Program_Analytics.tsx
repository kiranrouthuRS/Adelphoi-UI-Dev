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
interface Program_AnalyticsProps {
    ROCList: any;
    PCRList: any;
    Location: any;
    Referral: any;
    filter: any;
    onSelectChange: (src: any) => void;
}

const ProgramAnalytics: React.FC<Program_AnalyticsProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    const program = {
        labels: [
            'Program completed',
            'Remained out of care'
        ],
        datasets: [{
            data: [props.PCRList.pcr ? props.PCRList.pcr.percentage.replace(/%/g, "") : 0, props.ROCList.roc ? props.ROCList.roc.percentage.replace(/%/g, "") : 0],
            backgroundColor: [
                '#FF6384',
                '#36A2EB'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
            ]
        }],

    };
    const [filters, setfilters] = useState({ referral_source: "", location: "" });

    useEffect(() => {
        props.onSelectChange(filters)
    }, [filters]);
    
    useEffect(()=>{
        console.log("hello")
        setfilters(prevState => {
            return { ...prevState, referral_status: "", referral_source: "", location: "" } 
        });
    },[props.filter.days_count]) 
    return (
        <div
        //style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}
        >
            {/* <h1 css={subHeading} >Program Analytics  – of referrals who are accepted and placed.​</h1> */}
            <Grid container spacing={3} >
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
                        //padding: "20px",
                        //marginBottom: "10px"

                    }} >
                        <strong> {props.PCRList.pcr ? props.PCRList.pcr.count : 0}</strong>

                    </div>
                                        Program completion rate

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
                        <strong> {props.ROCList.roc ? props.ROCList.roc.count : 0}</strong>

                    </div>
    Remain out of care

</div>
                <div css={twoCol}>

                    <Pie data={program}
                        options={{
                            responsive: true,
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

export default ProgramAnalytics;
