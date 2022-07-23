import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from 'react';

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

export default function TestChart(props) {
    const classes = useStyles();
    // const data = [{name: 'Bucket 1', numberOfSites: 25}, {name: 'Bucket 2', numberOfSites: 72}, {name: 'Bucket 3', numberOfSites: 51}];
    const [data, setData] = useState({});

    useEffect(() => {
        let b1 = 0;
        let b2 = 0;
        let b3 = 0;
        let b4 = 0;
        let b5 = 0;
        props.sparsityData.forEach((site) => {
            if(site.sparsityScore < 1) b1 += 1;
            else if(site.sparsityScore < 5) b2 += 1;
            else if(site.sparsityScore < 100) b3 += 1;
            else if(site.sparsityScore < 1000) b4 += 1;
            else b5 += 1;
        });
        const tempData = [
            {name: '0-1', numberOfSites: b1},
            {name: '1-5', numberOfSites: b2},
            {name: '5-100', numberOfSites: b3},
            {name: '100-1000', numberOfSites: b4},
            {name: '>1000', numberOfSites: b5}
        ];
        setData(tempData);
    }, [props.sparsityData]);

    if(props.sparsityData.length > 0) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <BarChart width={600} height={300} data={data}>
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis />
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