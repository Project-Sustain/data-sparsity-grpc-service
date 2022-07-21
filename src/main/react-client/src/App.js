
import {React} from 'react'
import UseConnectionStatus from './hooks/UseConnectionStatus';
import Checkbox from '@mui/material/Checkbox';

import { makeStyles } from "@material-ui/core";
import { FormControlLabel, Paper, Stack } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px",
    width: "12vw"
  }
});

export default function App() {
  const classes = useStyles();
  const {serverConnection, DbConnection} = UseConnectionStatus();
  return (
    <Paper className={classes.paper} elevation={2}>
      <Stack>
        <FormControlLabel
          label="Server Connected"
          control={<Checkbox checked={serverConnection}/>}
        />
        <FormControlLabel
          label="Database Connected"
          control={<Checkbox checked={DbConnection}/>}
        />
      </Stack>
    </Paper>
  );
}
