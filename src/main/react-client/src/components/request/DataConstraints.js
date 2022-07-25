import { Paper, Typography } from '@mui/material';
import { makeStyles } from "@material-ui/core";
import IndividualConstraint from './IndividualConstraint';


const useStyles = makeStyles({
    root: {
        margin: "10px",
        padding: "10px",
        overflow: "auto",
        maxHeight: "30vh"
    }
});

export default function DataConstraints(props) {
    const classes = useStyles();

    if(props.dataConstraints.length > 0) {
        return (
            <>
                <Typography align='center' variant='h6'>Data Constraints</Typography>
                <Paper elevation={1} className={classes.root}>
                    {
                        props.dataConstraints.map((constraint, index) => {
                            return (
                                <IndividualConstraint key={index} constraint={constraint} />
                            );
                        })
                    }
                </Paper>
            </>
        )
    }

    else return null;

    
}