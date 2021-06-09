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
interface Other_AnalyticsProps {
    Replace_analytics: any;
    Stay_analytics: any;
    Occupancy_analytics: any;
    Location: any;
    Referral: any;
    filter: any;
    onSelectChange: (src: any) => void;
}

const OtherParam_Analytics: React.FC<Other_AnalyticsProps> = props => {
    const classes = useStyles();
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
        <div >
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
                <Grid item xs={6} sm={4}>
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
                         background: "#ffffff",
                         border: "3px solid black",
                         width: "150px",
                         height: "150px",
                         borderRadius: "50%",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         color: "#000000",
                        // padding: "20px",
                        // marginBottom: "10px"

                    }} >
                        <strong> {props.Replace_analytics.replacement_rate ? props.Replace_analytics.replacement_rate : 0}</strong>
                    </div>
Replacement rate

                                </div>
                <div css={twoCol}>

                    <div style={{
                        background: "#ffffff",
                        border: "3px solid black",
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000000",
                        //padding: "20px",
                        //marginBottom: "10px"

                    }} >
                        <strong> {props.Stay_analytics.avg_length_of_stay ? props.Stay_analytics.avg_length_of_stay : 0}</strong>
                    </div>
                                        Average Length of stay

                                </div>
                

            </div>

        </div>
    );
};

export default OtherParam_Analytics;
