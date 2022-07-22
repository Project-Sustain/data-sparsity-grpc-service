
import { React, useCallback, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from '@mui/material';
import  { useStream } from 'react-fetch-streams';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px",
    minWidth: "25vw",
    minHeight: "12vh"
  }
});

export default function SparsityData(props) {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [sparsityScores, setSparsityScores] = useState();

    function formatSiteData(siteData) {
      return (
        <>
          <Typography>Monintor ID: {siteData.monitorId}</Typography>
          <Typography>Sparsity Score: {JSON.stringify(siteData.sparsityScore)}</Typography>
          <Typography>Coordinates: ({JSON.stringify(siteData.coordinates.latitude)}, {JSON.stringify(siteData.coordinates.longitude)})</Typography>
          <Typography>Number of Measurements: {JSON.stringify(siteData.numberOfMeasurements)}</Typography>
          <Typography>Epoch Times: {JSON.stringify(siteData.epochTimes)}</Typography>
        </>
      );
    }
    const onNext = useCallback(async res => {
      try{
        const streamedResult = await res.json();
        setSparsityScores(streamedResult);
      } catch (error) {}
    }, []);
    useStream('http://127.0.0.1:5000/sparsityScores', { onNext });

    if(sparsityScores) {
      return (
        <Paper className={classes.paper} elevation={2}>
          {formatSiteData(sparsityScores)}
        </Paper>
      )
    }

    else {
      return (
        <Paper className={classes.paper} elevation={2}>
          <Typography>Sparsity Data Coming...</Typography>
        </Paper>
      );
    }
}
