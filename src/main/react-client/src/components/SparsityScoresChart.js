import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { mean, standardDeviation } from 'simple-statistics';

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
        maxHeight: "70vh",
        maxWidth: "40vw",
        overflow: "auto"
    },
    chart: {
        width: "15vw",
        height: "7vh"
    }
});

export default function SparsityScoresChart(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [average, setAverage] = useState(0);

    useEffect(() => {
        if(props.sparsityData.length > 0){
            const scores = props.sparsityData.map((siteData) => {return siteData.sparsityScore});
            const scores_sd = standardDeviation(scores);
            const scores_mean = mean(scores)

            console.log({scores});
            console.log({scores_sd})
            console.log({scores_mean})

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
            setAverage(scores_mean.toFixed(3));
            setData(tempData);
        }
    }, [props.sparsityData]);

    if(props.sparsityData.length > 0) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography align='center'>Average Sparsity Score: {average}</Typography>
                <BarChart width={600} height={300} data={data}>
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="numberOfSites" fill="#8884d8" barSize={30} />
                </BarChart>
            </Paper>
        );
    }
    else {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography>Chart Loading...</Typography>
            </Paper>
        );
    }
}