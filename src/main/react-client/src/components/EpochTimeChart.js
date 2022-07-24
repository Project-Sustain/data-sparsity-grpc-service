import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, Slider } from "@mui/material";
import { useEffect, useState } from 'react';
import moment from 'moment';
import { sum } from 'simple-statistics';

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
        maxHeight: "70vh",
        maxWidth: "90vw",
        overflow: "auto"
    },
    chart: {
        width: "15vw",
        height: "7vh"
    }
});

export default function EpochTimeChart(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [numBuckets, setNumbuckets] = useState(10);

    useEffect(() => {
        if(props.sparsityData.length > 0) {
            const timeLists = props.sparsityData.map((siteData) => {
                return siteData.epochTimes.map((time) => {return parseInt(time)});
            });
            const times = [].concat.apply([], timeLists);
            times.sort();
            const count = {};
            let chartData = [];
            times.forEach(element => {
                count[element] = (count[element] || 0) + 1;
            })
            for (const [key, value] of Object.entries(count)) {
                chartData.push({'value': value, 'time': parseInt(key)});
            }
            const items_per_bucket = chartData.length / numBuckets;
            let bucketData = [];
            for(let i = 0; i < numBuckets; i++) {
                bucketData.push(convertBucket(chartData.slice(i*items_per_bucket, (i+1)*items_per_bucket)));
            }
            setData(bucketData);
        }
        
    }, [props.sparsityData, numBuckets]);

    useEffect(() => {

    }, []);


    function convertBucket(bucket) {
        const startTime = moment.unix(bucket[0].time/1000).format('MM/YYYY');
        const endTime = moment.unix(bucket[bucket.length-1].time/1000).format('MM/YYYY');
        const values = bucket.map(entry => {return entry.value});
        const totalValue = sum(values);
        return {'name': `${startTime} - ${endTime}`, 'Number of Observations': totalValue};
    }


    if(props.sparsityData.length > 0) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography align='center'>Number of Observations by Time</Typography>
                <LineChart
                    width={1700}
                    height={400}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="Number of Observations" 
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
                <Slider
                    value={numBuckets ?? 10}
                    min={5}
                    max={50}
                    marks
                    valueLabelDisplay="auto"
                    step={1}
                    onChange={(event, newValue) => setNumbuckets(newValue)}
                >
                </Slider>
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