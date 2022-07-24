import { makeStyles } from "@material-ui/core";
import { Divider, Paper, Typography, List, ListItemText, Stack } from '@mui/material';
import moment from 'moment';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
    },
    list: {
        padding: '10px',
        margin: '10px',
        maxHeight: '25vh',
        overflow: 'auto'
    },
    listItem: {
        margin: '10px'
    },
});

export default function SelectedSite(props) {
    const classes = useStyles();
    if(props.site) {
        const dates = props.site.epochTimes.map((epoch) => {
            return moment.unix(epoch/1000).format('MM/DD/YYYY HH:mm:ss');
        })
        return (
            <Paper className={classes.paper}>
                <Typography variant='h5' align='center'>Info for Site {props.site.monitorId}</Typography>
                <Stack direction='row' justifyContent='space-around' >
                    <Paper className={classes.paper}>
                        <Typography><strong>Formal Name:</strong> {props.site.organizationFormalName}</Typography>
                        <Typography><strong>Site Type:</strong> {props.site.monitoringLocationTypeName}</Typography>
                        <Typography><strong>Absolute Sparsity Score:</strong> {props.site.sparsityScore}</Typography>
                        <Typography><strong>Relative Sparsity Score:</strong> {props.site.relativeSparsityScore}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography align='center' variant='h6'>{props.site.numberOfMeasurements} Measurements</Typography>
                        <List className={classes.list}>
                            {dates.map((date, index) => {
                                return <ListItemText className={classes.listItem} key={index}>{date}</ListItemText>
                            })}
                        </List>
                    </Paper>

                </Stack>
                {/* <Typography>Coordinates: {props.site.coordinates.latitude}, {props.site.coordinates.longitude}</Typography> */}
                <Divider textAlign="left">Data Samples Over Time</Divider>
            </Paper>
        );
    }
    else {
        return (
            <Paper className={classes.paper}>
                <Typography>Data Loading...</Typography>
            </Paper>
        );
    }
}