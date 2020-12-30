/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
interface Market_AnalyticsProps {
    marketList: any;
    Referral: any;
    PerformanceList: any
    referralChange: (src: any) => void;
}

const Market_Analytics: React.FC<Market_AnalyticsProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    let PerformanceDate = props.PerformanceList.map((program,key) => program.date)
    let PerformanceCount = props.PerformanceList.map((program,key) => program.count)
    const Performance = {
        labels: PerformanceDate,
        datasets: [
            {
                label: 'Number Of Referrals',
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
                data: PerformanceCount
            }
        ]
    };
    const [referral_source, setreferral_source] = useState("0");
    useEffect(() => {
        props.referralChange(referral_source)
    }, [referral_source]);
    return (
        <div
        // style={{ border: "solid #5B6DCD 1px", padding: "10px", marginBottom: "10px" }}
        >
            {/* <h1 css={subHeading} >Market Analysis - Customer Trends – Referral Source Analysis​</h1> */}
            <Accordion>
                <AccordionSummary
                    css={panelHeader}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                >
                    <h1 css={panelHeading}>
                        Referral Source Analysis
                                ​</h1>
                </AccordionSummary>
                <AccordionDetails css={panel}>
                <Table aria-label="clients table" css={dataTable}>
                <TableHead>
                    <TableRow css={tableHeader}>
                        <TableCell>Referral Source Name</TableCell>
                        <TableCell>Number of referrals​</TableCell>
                        <TableCell>Contribution in %</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.marketList.length > 0 ? (
                        props.marketList.map((pgm, key) => (
                            <TableRow
                                hover
                                key={key || undefined}
                                css={tableRow}
                            >
                                <TableCell>{pgm.referral_source}</TableCell>
                                <TableCell>{pgm.count}</TableCell>
                                <TableCell>{pgm.percentage}</TableCell>

                            </TableRow>
                        ))
                    ) : (
                            <TableRow key={9999}>
                                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                    No results found
                </TableCell>
                            </TableRow>
                        )}

                </TableBody>
            </Table>
                </AccordionDetails>
            </Accordion>
            
            <br />
            <Grid item xs={6} sm={3}>
                <label css={txtLabel}
                //style={{ marginTop: 16 }}
                >
                    Referral sources:
                  </label>

                <select
                    css={selectField}
                    name="referral_source"
                    value={referral_source || ""}
                    onChange={(e) => setreferral_source(e.target.value)}
                >
                    {props.Referral.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.value}
                        </option>
                    ))}
                </select>
            </Grid>
            {/* <Grid container spacing={1} >
                                <Grid item xs={6}> */}
            <Line data={Performance}
                  options={{
                    legend: {
                        display: false
                     },
                     title: {
                        display: true,
                        text: 'Performance Graph'
                    }
                }}
                 />
            {/* </Grid> */}
            {/* </Grid> */}
        </div>
    );
};

export default Market_Analytics;
