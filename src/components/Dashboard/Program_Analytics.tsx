/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
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
    outerCircle,
    selectField,
    fieldRow,
    circleContent,
    twoCol,
    innerCircle,
    smallcircleContent,
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
    }, [filters.referral_source || filters.location]);

    useEffect(() => {
        setfilters(prevState => {
            return { ...prevState, referral_status: "", referral_source: "", location: "" }
        });
    }, [props.filter.days_count])
    return (
        <div>
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
                    <div css={outerCircle}>
                        <span css={circleContent}>
                            <strong >{props.PCRList.pcr ? props.PCRList.pcr.count : 0} <br /> PCR  </strong>
                        </span>
                        <div css={innerCircle}>
                            <span css={smallcircleContent}>
                                <strong>{props.ROCList.roc ? props.ROCList.roc.count : 0}  <br /> ROC </strong>
                            </span>
                        </div>

                    </div>
                    
                </div>
                <div css={twoCol}>
                    <div style={{marginTop: "50px"}}>
                    <strong >  PCR - </strong>Program Completion Rate <br />
                    <strong >  ROC - </strong>Remained Out of Care
                   </div>
                   </div>
                   <div css={twoCol}>
                   &nbsp;
                   </div>
                   
            </div>

        </div>
    );
};

export default ProgramAnalytics;
