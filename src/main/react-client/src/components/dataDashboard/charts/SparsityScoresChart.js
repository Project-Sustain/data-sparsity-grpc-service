import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, LinearProgress } from "@mui/material";
import { useEffect, useState } from 'react';
import { mean, standardDeviation } from 'simple-statistics';
import { colors } from '../../../helpers/colors';

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
        overflow: "auto"
    },
    chart: {
        width: "100%",
        height: 300
    }
});

export default function SparsityScoresChart(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [average, setAverage] = useState(0);
    const [stdDev, setStdDev] = useState(0);

    useEffect(() => {
        if(props.sparsityData.length > 0){
            const scores = props.sparsityData.map((siteData) => {return siteData.sparsityScore});
            setStdDev(standardDeviation(scores).toFixed(2));
            setAverage(mean(scores).toFixed(2));

            const cutoff_1 = 0.001;
            const cutoff_2 = 0.01;
            const cutoff_3 = 0.1;
            const cutoff_4 = 1;

            const bucket1 = scores.filter(score => score < cutoff_1);
            const bucket2 = scores.filter(score => score >= cutoff_1 && score < cutoff_2);
            const bucket3 = scores.filter(score => score >= cutoff_2 && score < cutoff_3);
            const bucket4 = scores.filter(score => score >= cutoff_3 && score < cutoff_4);
            const bucket5 = scores.filter(score => score >= cutoff_4);

            const tempData = [
                {name: `0-${cutoff_1}`, numberOfSites: bucket1.length},
                {name: `${cutoff_1}-${cutoff_2}`, numberOfSites: bucket2.length},
                {name: `${cutoff_2}-${cutoff_3}`, numberOfSites: bucket3.length},
                {name: `${cutoff_3}-${cutoff_4}`, numberOfSites: bucket4.length},
                {name: `>${cutoff_4}`, numberOfSites: bucket5.length}
            ];

            setData(tempData);
        }
    }, [props.sparsityData]);

    if(props.streamComplete && !props.noData) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography variant='h5' align='center'>Sparsity Score Spread, Mean: {average}, Std Dev: {stdDev}</Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="numberOfSites" fill={colors.secondary} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        );
    }

    else if(props.streamComplete && props.noData) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography>No Data Matching Request</Typography>
            </Paper>
        );
    }

    else if(props.requestPending) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography>Chart Loading...</Typography>
                <LinearProgress color='secondary' />
            </Paper>
        );
    }
    
    else return null;
}