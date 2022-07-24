import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import moment from 'moment'

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

    useEffect(() => {
        if(props.sparsityData.length > 0) {
            const timeLists = props.sparsityData.map((siteData) => {
                return siteData.epochTimes.map((time) => {return parseInt(time)});
            });
            const times = [].concat.apply([], timeLists);
            const count = {};
            let chartData = [];
            times.forEach(element => {
                count[element] = (count[element] || 0) + 1;
            })
            for (const [key, value] of Object.entries(count)) {
                chartData.push({'value': value, 'time': parseInt(key)});
            }
            // FIXME bucket chartData! based on size of chartData
            setData(chartData)
        }
        
    }, [props.sparsityData]);


    if(props.sparsityData.length > 0) {
        return (
            <Paper elevation={2} className={classes.paper}>
                {/* <ScatterChart width={900} height={500}>
                    <XAxis
                        dataKey="time"
                        domain = {['auto', 'auto']}
                        tickFormatter = {(unixTime) => moment(unixTime).format('YYYY')}
                        type="number"
                    />
                    <YAxis dataKey = 'value' />
                    <Scatter
                        data = {data}
                        line = {{ stroke: '#111' }}
                    />
                </ScatterChart> */}

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={900}
                        height={400}
                        data={data}
                        // margin={{
                        //     top: 5,
                        //     right: 30,
                        //     left: 20,
                        //     bottom: 5,
                        // }}
                    >
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        <XAxis 
                            dataKey="time"
                            tickFormatter = {(unixTime) => moment(unixTime).format('YYYY')}
                        />
                        <YAxis />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            // activeDot={{ r: 3 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>

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