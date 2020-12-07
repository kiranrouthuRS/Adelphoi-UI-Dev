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
import { Bar } from 'react-chartjs-2';
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
interface Client_DemographicsProps {
    Gender_List: any;
    Age_List: any;
    Demo_List: any;
    onSelectChange: (src: any) => void;
}

const Client_Demographics: React.FC<Client_DemographicsProps> = props => {
    // const history = useHistory();
    const classes = useStyles();
    const [filters, setfilters] = useState({ q: "lang"});
    const gender = {
        labels: ['Female', 'Male'],
        datasets: [{
            label: 'Gender',
            barPercentage: 0.25,
            data: [props.Gender_List.female, props.Gender_List.male],
            backgroundColor: [
                '#FF6384',
                '#1565c0'
            ],
        },

        ],

    };
    let ages = props.Age_List.map(age => age.value);
    let count = props.Age_List.map(age => age.count);
    const age = {
        labels: ages,
        datasets: [{
            label: 'Age',
            barPercentage: 0.25,
            data: count,
            backgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4','#FF6384', '#FF0084'],
            hoverbackgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4','#FF6384', '#FF0084']
        },

        ],

    };
    let demo1 = props.Demo_List.map(demo => demo.value);
     let demo2 = props.Demo_List.map(demo => demo.count);
    
    const disc = {
        labels: demo1,
        datasets: [{
            //label: filters.q === "lang"? "Primary Language":filters.q === "ls_type"? "Legal Status":"Secondary Involvement",
            label: "none", 
            barPercentage: 0.25,
            data: demo2,
            backgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4','#36A2EB'],
            hoverbackgroundColor: ['#a3863b', '#3b90a3', '#d21243', '#3700FF', '#ffa600', '#038c25', '#C9DE00', '#00A6B4', '#a1124b', '#48fc12', '#FB13F3', '#cc1fa4', '#36A2EB']
        },

        ], 

    };
    

    useEffect(() => {
        props.onSelectChange(filters)
    }, [filters]);
    
    return (
        <div >
            <Grid container spacing={1} >
            
                <Grid item xs={6}>
               <Bar
                        data={gender}
                        // width={100}
                        // height={50}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false 
                             },
                             title: {
                                display: true,
                                text: 'Gender'
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Bar
                        data={age}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                             },
                             title: {
                                display: true,
                                text: 'Age'
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} >
                
                <Grid item xs={6}>
            <select
                    css={selectField}
                    name="q"
                    value={filters.q || ""}
                    onChange={(e) => setfilters(prevState => {
                        return { ...prevState, q: e.target.value }
                    })}
                >
                    <option value="lang">Primary Language</option>
                    <option value="ls_type">Legal Status</option>
                    <option value="sec_inv_cyf">Secondary Involvement</option>

                </select>
                </Grid>
                </Grid>
            <Grid container spacing={1} >
                
                <Grid item xs={6}>
                    <Bar
                        data={disc}
                        // width={100}
                        // height={50}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                             },
                             title: {
                                display: true,
                                text: filters.q === "lang"? "Primary Language":filters.q === "ls_type"? "Legal Status":"Secondary Involvement",
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default Client_Demographics;
