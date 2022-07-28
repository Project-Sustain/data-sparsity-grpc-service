import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, LinearProgress, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Stack } from "@mui/material";
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

    const scaleArray = [
        {'name': 'Exponential 1', 'scale': [0.001, 0.01, 0.1, 1]},
        {'name': 'Exponential 2', 'scale': [1, 10, 100, 1000]},
        {'name': 'Log 1', 'scale': [0.1, 1, 1.1, 1.01]},
        {'name': 'Linear 1', 'scale': [25, 50, 75, 100]},
        {'name': 'Linear 2', 'scale': [50, 100, 150, 200]}
    ];

    const [data, setData] = useState({});
    const [average, setAverage] = useState(0);
    const [stdDev, setStdDev] = useState(0);
    const [scores, setScores] = useState([]);
    const [scale, setScale] = useState(scaleArray[0]);

    useEffect(() => {
        if(props.sparsityData.length > 0){
            const tempScores = props.sparsityData.map((siteData) => {return siteData.sparsityScore});
            setScores(tempScores)
            setStdDev(standardDeviation(tempScores).toFixed(2));
            setAverage(mean(tempScores).toFixed(2));
        }
    }, [props.sparsityData]);

    useEffect(() => {
        if(scores.length > 0){
            const bucket1 = scores.filter(score => score < scale.scale[0]);
            const bucket2 = scores.filter(score => score >= scale.scale[0] && score < scale.scale[1]);
            const bucket3 = scores.filter(score => score >= scale.scale[1] && score < scale.scale[2]);
            const bucket4 = scores.filter(score => score >= scale.scale[2] && score < scale.scale[3]);
            const bucket5 = scores.filter(score => score >= scale.scale[3]);

            const tempData = [
                {name: `0-${scale.scale[0]}`, numberOfSites: bucket1.length},
                {name: `${scale.scale[0]}-${scale.scale[1]}`, numberOfSites: bucket2.length},
                {name: `${scale.scale[1]}-${scale.scale[2]}`, numberOfSites: bucket3.length},
                {name: `${scale.scale[2]}-${scale.scale[3]}`, numberOfSites: bucket4.length},
                {name: `>${scale.scale[3]}`, numberOfSites: bucket5.length}
            ];

            setData(tempData);
        }
    }, [scores, scale]);

    const updateScale = (event) => {
        const value = parseInt(event.target.value);
        setScale(scaleArray[value]);
    }

    if(props.streamComplete && !props.noData) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Stack
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    spacing={2}
                >
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
                        <FormLabel align='center' color='secondary' id="scale">X-Axis Scale</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="scale"
                            value={scaleArray.findIndex((element) => {return element.name === scale.name})}
                            onChange={updateScale}
                        >
                            {scaleArray.map((scale, index) => {
                                    return <FormControlLabel key={index} value={index} control={<Radio color='secondary' />} label={scale.name} />
                            })}
                        </RadioGroup>
                    </FormControl>
                </Stack>
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