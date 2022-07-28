import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, Slider, Divider } from "@mui/material";
import { useEffect, useState } from 'react';
import moment from 'moment';
import { sum } from 'simple-statistics';
import { colors } from '../helpers/colors';

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
    },
    divider: {
        margin: '20px'
    }
});

export default function EpochTimeChart(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [siteDataMap, setSiteDataMap] = useState([]);
    const [numBuckets, setNumbuckets] = useState(100);

    /**
     * This function will eventually take place in the gRPC java server, and be send via an rpc.
     */
    useEffect(() => {
        if(props.sparsityData.length > 0) {
            const timeLists = props.sparsityData.map((siteData) => {
                return siteData.epochTimes.map((time) => {return parseInt(time)});
            });
            const times = [].concat.apply([], timeLists);
            const countDuplicates = {};
            times.forEach(element => {
                countDuplicates[element] = (countDuplicates[element] || 0) + 1;
            })
            const chartData = Object.entries(countDuplicates).map(([key, value]) => {
                return {'value': value, 'time': parseInt(key)};
            });
            chartData.sort((a, b) => {return a.time - b.time});
            setSiteDataMap(chartData);
        }
    }, [props.sparsityData]);

    useEffect(() => {
        if(siteDataMap.length > 0) {
            const items_per_bucket = siteDataMap.length / numBuckets;
            let bucketData = [];
            for(let i = 0; i < numBuckets; i++) {
                bucketData.push(convertBucket(siteDataMap.slice(i*items_per_bucket, (i+1)*items_per_bucket)));
            }
            setData(bucketData);
        }
    }, [props.sparsityData, numBuckets, siteDataMap]);

    function convertBucket(bucket) {
        const startTime = moment.unix(bucket[0].time/1000).format('MM/YYYY');
        const endTime = moment.unix(bucket[bucket.length-1].time/1000).format('MM/YYYY');
        const values = bucket.map(entry => {return entry.value});
        const totalValue = sum(values);
        return {'name': `${startTime} - ${endTime}`, 'Number of Observations': totalValue};
    }

    if(props.streamComplete) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography variant='h5' align='center'>Number of Observations by Time</Typography>
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
                    <XAxis
                        dataKey="name"
                        // tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="Number of Observations" 
                        stroke={colors.tertiary}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
                <Divider className={classes.divider} textAlign="left">Granularity Control</Divider>
                <Slider
                    value={numBuckets ?? 10}
                    min={5}
                    max={200}
                    color='tertiary'
                    // marks
                    // valueLabelDisplay="auto"
                    step={1}
                    onChange={(event, newValue) => setNumbuckets(newValue)}
                />
            </Paper>
        );
    }

    else if(props.requestPending) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography>Chart Loading...</Typography>
            </Paper>
        );
    }
    else return null;
}