import { makeStyles } from "@material-ui/core";
import { Paper, Typography, List, ListItemText, Stack, LinearProgress } from '@mui/material';
import moment from 'moment';

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
    if(props.streamComplete && props.site && !props.noData) {
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
            <Paper className={classes.paper}>
                <Typography>Data Loading...</Typography>
                <LinearProgress />
            </Paper>
        );
    }

    else return null;
}