/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
    outerCircle,
    selectField,
    fieldRow,
    circleContent,
    twoCol,
    innerCircle,
    smallcircleContent,
    txtLabel,

} from "../styles";
import { Doughnut } from 'react-chartjs-2';
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);


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
    const PCR_Data = {
        labels: [
            'Positive Program Completion',
            'Negative Program Completion',
            'Program Completion Not Available​'
        ],
        datasets: [{
            data: [
                props.PCRList.positive_pcr ? props.PCRList.positive_pcr.count : 0,
                props.PCRList.negative_pcr ? props.PCRList.negative_pcr.count : 0,
                props.PCRList.other_pcr ? props.PCRList.other_pcr.count : 0
            ],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }],
        text: '23%'
    };

    const ROC_Data = {
        labels: [
            'Remained Out of Care',
            'Returned to Care',
            'Threshold for review not met (<1 year)',
            'Record not available'
        ],
        datasets: [{
            data: [
                props.ROCList.positive_roc ? props.ROCList.positive_roc.count : 0,
                props.ROCList.negative_roc ? props.ROCList.negative_roc.count : 0,
                props.ROCList.less_than_1_year ? props.ROCList.less_than_1_year.count : 0,
                props.ROCList.greater_than_1_year ? props.ROCList.greater_than_1_year.count : 0,
            ],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                '#a3863b'
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                '#a3863b'
            ]
        }],
        text: '23%'
    };

     let  options: any = {
       plugins: {
            legend: {
                display: true,
                position: "top" 
            },
           
              datalabels: {
                color: "white",
                 font: {
                   weight: "bold",
                   size: "16px"
                 },
              },
         }
          };

    const [filters, setfilters] = useState({ referral_source: "", location: "" });
useEffect(() => {
        props.onSelectChange(filters)
    }, [filters.referral_source]);
    useEffect(() => {
        props.onSelectChange(filters)
    }, [filters.location]);

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
                        onChange={e => {
                            const val = e.target.value;
                            setfilters(prevState => {
                                return { ...prevState, referral_source: val }
                            });
                        }}
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
                        onChange={e => {
                            const val = e.target.value;
                            setfilters(prevState => {
                                return { ...prevState, location: val }
                            });
                        }}
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
            <div css={fieldRow} >
                <div css={twoCol} >

                    <Doughnut data={PCR_Data}  
                    options={options}
                          height={320}
                          width={350} />    

<div style={{marginLeft:"170px", transform:'translate(7%, -945%)'}}> <strong>{props.PCRList.total&& `Total - ${props.PCRList.total.count}`}</strong></div> 
                </div>
                <div css={twoCol} > 

                    <Doughnut data={ROC_Data}    
                        options={options}
                        height={320}
                        width={350} />

             <div style={{marginLeft:"125px", 
                          textAlign:"center",
                          hyphens: "auto", 
                          display:"flex", 
                          wordWrap:"break-word", overflow:"inherit", 
                          justifyContent:"center", 
                           transform:'translate(-20%, -960%)'}}> 
                           <strong >
                               {props.ROCList.total&& `+ Program Completion - ${props.ROCList.total.count}`}
                               </strong> </div>
                </div>

            </div>

        </div>
    );
};

export default ProgramAnalytics;
