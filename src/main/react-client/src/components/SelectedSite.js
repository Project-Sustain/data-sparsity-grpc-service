import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from '@mui/material';

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
        maxHeight: "70vh",
        maxWidth: "40vw",
        overflow: "auto"
    }
});

export default function SelectedSite(props) {
    const classes = useStyles();
    if(props.site) {
        return (
            <Paper className={classes.paper}>
                <Typography>Monitor ID: {JSON.stringify(props.site.monitorId)}</Typography>
                <Typography>Formal Name: {JSON.stringify(props.site.organizationFormalName)}</Typography>
                <Typography>Site Type: {JSON.stringify(props.site.monitoringLocationTypeName)}</Typography>
                <Typography>Score: {props.site.sparsityScore}</Typography>
                <Typography>Number of Measurements: {props.site.numberOfMeasurements}</Typography>
                <Typography>Sites: {JSON.stringify(props.site.epochTimes)}</Typography>
                <Typography>Coordinates: {props.site.coordinates.latitude}, {props.site.coordinates.longitude}</Typography>
            </Paper>
        );
    }
    else return null;
}