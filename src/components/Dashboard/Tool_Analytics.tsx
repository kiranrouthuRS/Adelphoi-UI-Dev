/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ConfigurationSchema } from "../ValidationSchema";
import { Line } from 'react-chartjs-2';
import {
    wrap,
    subHeading,
    selectField,
    panel,
    panelHeading,
    panelHeader,
    txtLabel,
    tableHeader,
    tableRow,
    dataTable,
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
interface Tool_AnalyticsProps {
    Tool_List: any;
    CalibrationList: any;
    onSelectChange: (src: any) => void;
}

const Tool_Analytics: React.FC<Tool_AnalyticsProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    let PCR_Chosen = props.CalibrationList.pcr_chosen&&props.CalibrationList.pcr_chosen.map(program => program.count)
    let PCR_Tool = props.CalibrationList.pcr_chosen&&props.CalibrationList.pcr_tool.map(program => program.count)
    let ROC_Chosen = props.CalibrationList.pcr_chosen&&props.CalibrationList.roc_chosen.map(program => program.count)
    let ROC_Tool = props.CalibrationList.pcr_chosen&&props.CalibrationList.roc_tool.map(program => program.count)
    const Performance = {
        labels: ["10","20","30","40","50","60","70","80","90","100"],
        datasets: [
            {
                label: 'pcr_chosen',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: PCR_Chosen
            },
            {
                label: 'pcr_tool',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#FF6384',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FF6384',
                pointHoverBorderColor: '#FF6384',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10, 
                data: PCR_Tool
            },
            {
                label: 'roc_chosen',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(200,2,0,1)',
                borderColor: 'rgba(200,2,0,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(200,2,0,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(200,2,0,1)',
                pointHoverBorderColor: 'rgba(200,2,0,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10, 
                data: ROC_Chosen
            },
            {
                label: 'roc_tool',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#a3863b',
                borderColor: '#a3863b',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#a3863b',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#a3863b',
                pointHoverBorderColor: '#a3863b',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10, 
                data: ROC_Tool
            }
        ]
    };
    const [filters, setfilters] = useState({pcr:"",roc:""});
    useEffect(() => {
        props.onSelectChange(filters)
    }, [filters]);
    return (
        <div
        // style={{ border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}
        >
            {/* <h1 css={subHeading} >Market Analysis - Customer Trends – Referral Source Analysis​</h1> */}
            <Grid container spacing={6} >
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        PCR:
                  </label>

                                    <select
                                        css={selectField}
                                        name="pcr"
                                        value={filters.pcr || ""}
                                        onChange={(e)=>setfilters(prevState => {
                                            return { ...prevState, pcr: e.target.value }
                                        })}
                                    >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <label css={txtLabel}
                                    //style={{ marginTop: 16 }}
                                    >
                                        ROC:
                  </label>

                                    <select
                                        css={selectField}
                                        name="roc"
                                        value={filters.roc || ""}
                                        onChange={(e)=>setfilters(prevState => {
                                            return { ...prevState, roc: e.target.value }
                                        })}
                                    >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </Grid>
                            </Grid>
            {/* <Grid container spacing={1} >
                                <Grid item xs={6}> */}
            {/* <h4>Performance Graph</h4> */}
            <Line data={Performance}  options={{
                    legend: {
                        display: true
                     },
                     title: {
                        display: true,
                        text: 'Performance Graph'
                    }
                }} />
            {/* </Grid>
            </Grid> */}
        </div>
    );
};

export default Tool_Analytics;
