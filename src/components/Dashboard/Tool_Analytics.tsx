/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Line } from 'react-chartjs-2';
import { selectField, txtLabel } from "../styles";


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
    ROCCalibrationList: any;
    PCRCalibrationList: any;
    onSelectChange: (src: any) => void;
}

const Tool_Analytics: React.FC<Tool_AnalyticsProps> = props => {
    // const history = useHistory();

    const classes = useStyles();
    let PCR_Count = Object.keys(props.PCRCalibrationList).map(list=>props.PCRCalibrationList[list].positive_percent)
    let PCR_Label = Object.keys(props.PCRCalibrationList).map(list=>list)
    let ROC_Count = Object.keys(props.ROCCalibrationList).map(list=>props.ROCCalibrationList[list].positive_percent)
    let ROC_Label = Object.keys(props.ROCCalibrationList).map(list=>list)
    const PCR_Performance = {
        labels: PCR_Label,
        datasets: [
            {
                label: "PCR",
                fill: false,
                lineTension: 0.1, 
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,0.4)',
                borderCapStyle: 'butt',
                borderDash: [5,5],
                borderDashOffset: 0.9,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,0.4)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 6,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,0.4)',
                pointHoverBorderColor: 'rgba(75,192,192,0.4)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
               data: PCR_Count
            },
            
        ]
    };
    const ROC_Performance = {
      labels: ROC_Label,
        datasets: [
            {
                label: "ROC",
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderCapStyle: 'butt',
                borderDash: [5,5],
                borderDashOffset: 0.9,
                borderJoinStyle: 'miter',
                pointBorderColor: '#FF6384',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 6, 
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FF6384',
                pointHoverBorderColor: '#FF6384',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10, 
                data: ROC_Count
            },
            
        ]
    };
    return (
        <div>
         
           <Grid container spacing={3} >
                                            
                                <Grid item xs={12}>         
                       <Line data={PCR_Performance}  options={{
                    legend: {
                        display: true
                     },
                    //  title: {
                    //     display: true,
                    //     text: 'PCR Performance Graph'
                    // },
                    scales: {
                        yAxes: [
                          {
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                                max: 100
                            },
                            scaleLabel: {
                              display: true,
                              //labelString: "Likelihood",
                            },
                          },
                        ],
                        xAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              // labelString: "Count",
                            },
                          },
                        ],
                      }
                }} />
              </Grid>
            </Grid>
            <Grid container spacing={3} >
            
                
                                    
                       <Line data={ROC_Performance}  options={{
                    legend: {
                        display: true
                     },
                    //  title: {
                    //     display: true,
                    //     text: 'ROC Performance Graph'
                    // },
                    scales: {
                        yAxes: [
                          {display: true,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                                max: 100
                            },
                            scaleLabel: {
                              display: true,
                              // labelString: "Likelihood",
                            },
                          },
                        ],
                        xAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              // labelString: "Count",
                            },
                            // grid: {
                            //     borderColor: 'red'
                            //   }
                          },
                        ],
                      }
                }} />
                </Grid>
            
        </div>
    );
};

export default Tool_Analytics;
