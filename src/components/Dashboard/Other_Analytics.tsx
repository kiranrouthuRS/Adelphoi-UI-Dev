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
interface Other_AnalyticsProps {
    Replace_analytics: any;
    Stay_analytics: any;
    Occupancy_analytics: any;
    Location: any;
    Referral: any;
    onSelectChange: (src:any) => void;
}

const OtherParam_Analytics: React.FC<Other_AnalyticsProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    const [filters, setfilters] = useState({referral_source:"",location:""});
    
    useEffect(() => {
        props.onSelectChange(filters)
      }, [filters]);
    
    return (
        <div 
        // style={{ boxSizing: "content-box", width: "100%", border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}
        >
                            {/* <h1 css={subHeading} >Other Parameters – of referrals who are accepted and placed.​</h1> */}
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
                                        onChange={(e)=>setfilters(prevState => {
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
                                        onChange={(e)=>setfilters(prevState => {
                                            return { ...prevState, location: e.target.value }
                                        })}
                                    >
                                        <option value="">Select</option>
                                        {props.Location.map(l => (
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
                                        <strong> {props.Replace_analytics.replacement_rate ? props.Replace_analytics.replacement_rate : 0}</strong>
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
                                            {props.Occupancy_analytics.occupancy_rate ? props.Occupancy_analytics.occupancy_rate : 0}
                                        </strong>
                                    </div>
Occupancy rate

                                </div>

                            </div>

                        </div>
 );
};

export default OtherParam_Analytics;
