
import { React } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px"
  }
});

export default function SparsityData(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    if(props.sparsityData) {
        return (
            <Paper className={classes.paper} elevation={2}>
            <Typography align="center">SparsityData</Typography>
            {props.sparsityData.map((entry, index) => {
                return <Typography key={index}>{entry}</Typography>
            })}
            </Paper>
        );
    }  
    else return null; 
}
