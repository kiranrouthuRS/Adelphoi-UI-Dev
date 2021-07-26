/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Pie } from 'react-chartjs-2';
import {
    tableHeader,
    tableRow,
    dataTable,
    label
} from "../styles";
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
interface Allocation_AnalyticsProps {
    Allocation_List: any;
    Program_Alloc_List: any;

}

const Allocation_Analytics: React.FC<Allocation_AnalyticsProps> = props => {
    const classes = useStyles();
    const [filters, setfilters] = useState({ referral_source: "", location: "" });
    const allocation = {
        labels: [
            'Tool',
            'Chosen'
        ],
        datasets: [{
            data: [Object.keys(props.Allocation_List).length > 0 
                && props.Allocation_List ? props.Allocation_List.tool 
                && props.Allocation_List.tool.percentage.replace(/%/g, "") : 0, 
                Object.keys(props.Allocation_List).length > 0 && props.Allocation_List ? 
                props.Allocation_List.chosen && props.Allocation_List.chosen.percentage.replace(/%/g, "") : 0],
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
    let allocatedPrograms = Array.isArray(props.Program_Alloc_List) && props.Program_Alloc_List.map(program => program.program)
    let allocatedProgramsPer = Array.isArray(props.Program_Alloc_List) && props.Program_Alloc_List.map(program => program.total.percentage.replace(/%/g, ""))
    const allocated = {
        labels: allocatedPrograms,
        datasets: [{
            data: allocatedProgramsPer,
            backgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4'],
            hoverbackgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4']
        }],

    };
    return (
        <div>
            <Grid container spacing={1} >
                <Grid item xs={12}>
                    <Pie data={allocation}
                        options={{
                            title: {
                                display: true,
                                text: 'Allocation of Program: Tool | Chosen'
                            },
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontColor: 'black',
                                    boxWidth: 15,
                                }

                            },

                        }}
                    />


                </Grid>
            </Grid>
            {/* <Grid container spacing={1} >
                <Grid item xs={12}>
                    <Pie data={allocated}
                        options={{
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Percentage of each program being allocated'
                            },
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontColor: 'black',
                                    boxWidth: 15,
                                },


                            },
                        }}
                    />


                </Grid>
            </Grid> */}

            <Table aria-label="clients table" css={dataTable}>
                <TableHead>
                    <TableRow css={tableHeader}>
                        <TableCell>Program</TableCell>
                        <TableCell>No of Clients​</TableCell>
                        <TableCell>% Tool​</TableCell>
                        <TableCell>% Chosen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.Program_Alloc_List.length > 0 ? (
                        props.Program_Alloc_List.map((pgm, key) => (
                            <TableRow
                                hover
                                key={key}
                                css={tableRow}
                            >
                                <TableCell>{pgm.program}</TableCell>
                                <TableCell>{pgm.total.count}</TableCell>
                                <TableCell>{pgm.tool.percentage}</TableCell>
                                <TableCell>{pgm.chosen.percentage}</TableCell>
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
        </div>
    );
};

export default Allocation_Analytics;
