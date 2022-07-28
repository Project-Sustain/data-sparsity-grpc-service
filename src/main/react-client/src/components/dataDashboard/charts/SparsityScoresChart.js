import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, LinearProgress, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material";
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
    const [scores, setScores] = useState([]);

    const scales = {
        'scale1': [0.001, 0.01, 0.1, 1],
        'scale2': [1, 10, 100, 1000],
        'scale3': [0.1, 1, 1.1, 1.01],
        'scale4': [25, 50, 75, 100],
        'scale5': [50, 100, 150, 200]
    }
    const scaleNames = Object.keys(scales);
    const [scaleName, setScaleName] = useState('');
    const [cutoffs, setCutoffs] = useState([]);

    useEffect(() => {
        if(props.sparsityData.length > 0){
            const tempScores = props.sparsityData.map((siteData) => {return siteData.sparsityScore});
            setScores(tempScores)
            setStdDev(standardDeviation(tempScores).toFixed(2));
            setAverage(mean(tempScores).toFixed(2));
            setCutoffs(scales.scale1);
            setScaleName(scaleNames[0])
        }
    }, [props.sparsityData]);

    useEffect(() => {
        if(scores.length > 0){
            const bucket1 = scores.filter(score => score < cutoffs[0]);
            const bucket2 = scores.filter(score => score >= cutoffs[0] && score < cutoffs[1]);
            const bucket3 = scores.filter(score => score >= cutoffs[1] && score < cutoffs[2]);
            const bucket4 = scores.filter(score => score >= cutoffs[2] && score < cutoffs[3]);
            const bucket5 = scores.filter(score => score >= cutoffs[3]);

            const tempData = [
                {name: `0-${cutoffs[0]}`, numberOfSites: bucket1.length},
                {name: `${cutoffs[0]}-${cutoffs[1]}`, numberOfSites: bucket2.length},
                {name: `${cutoffs[1]}-${cutoffs[2]}`, numberOfSites: bucket3.length},
                {name: `${cutoffs[2]}-${cutoffs[3]}`, numberOfSites: bucket4.length},
                {name: `>${cutoffs[3]}`, numberOfSites: bucket5.length}
            ];

            setData(tempData);
        }
    }, [scores, cutoffs]);

    const updateScale = (event) => {
        const value = event.target.value;
        setScaleName(value);
        setCutoffs(scales[value]);
    }

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
                <FormControl>
                    <FormLabel color='secondary' id="scale">X-Axis Scale</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="scale"
                        value={scaleName}
                        onChange={updateScale}
                    >
                        <FormControlLabel value='scale1' control={<Radio color='secondary' />} label="Exponential 1" />
                        <FormControlLabel value='scale2' control={<Radio color='secondary' />} label="Exponential 2" />
                        <FormControlLabel value='scale3' control={<Radio color='secondary' />} label="Log 1" />
                        <FormControlLabel value='scale4' control={<Radio color='secondary' />} label="Linear 1" />
                        <FormControlLabel value='scale5' control={<Radio color='secondary' />} label="Linear 2" />
                    </RadioGroup>
                </FormControl>
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