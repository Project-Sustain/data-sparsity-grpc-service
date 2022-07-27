import { useEffect, useState } from 'react';
import { Paper, Typography, TextField } from '@mui/material';
import { makeStyles } from "@material-ui/core";
import IndividualConstraint from './IndividualConstraint';


const useStyles = makeStyles({
    root: {
        margin: "10px",
        padding: "10px",
        overflow: "auto",
        maxHeight: "30vh"
    },
    searchBox: {
        width: '100%'
    }
});

export default function DataConstraints(props) {
    const classes = useStyles();
    const [searchString, setSearchString] = useState("");
    const [visibleContraints, setVisibleConstraints] = useState([]);

    useEffect(() => {
        setVisibleConstraints(props.dataConstraints);
    }, [props.dataConstraints]);

    const onChange = (event) => {
        const newValue = event.target.value;
        setSearchString(newValue);
        const results = props.dataConstraints.filter(word => word.includes(newValue));
        setVisibleConstraints(results);
    }

    if(props.dataConstraints.length > 0) {
        return (
            <>
                <Typography align='center' variant='h6'>Data Constraints</Typography>
                <TextField
                    value={searchString}
                    className={classes.searchBox}
                    label="Search Constraints..."
                    variant="outlined"
                    onChange={onChange}
                />
                <Paper elevation={1} className={classes.root}>
                    {
                        visibleContraints.map((constraint, index) => {
                            return (
                                <IndividualConstraint
                                    key={index}
                                    constraint={constraint}
                                    selectedConstraints={props.selectedConstraints}
                                    setSelectedConstraints={props.setSelectedConstraints}
                                />
                            );
                        })
                    }
                </Paper>
            </>
        )
    }

    else return null;

    
}