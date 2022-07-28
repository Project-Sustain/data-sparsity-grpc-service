
import { React } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { FormControlLabel, Paper, Stack, Typography, Checkbox } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px"
  }
});

export default function ApplicationStatus(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Paper className={classes.paper} elevation={2}>
      <Typography align="center" variant='h5'>Application Status</Typography>
      <Stack>
        <FormControlLabel
          label="Connected to Cluster"
          control={<Checkbox checked={props.serverConnection}/>}
        />
        <FormControlLabel
          label="Connected to Data Services"
          control={<Checkbox checked={props.DbConnection}/>}
        />
      </Stack>
    </Paper>
  );
}
