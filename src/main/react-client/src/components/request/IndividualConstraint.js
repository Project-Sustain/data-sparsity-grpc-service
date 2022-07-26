import { useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';


const useStyles = makeStyles({
    root: {
        // margin: "0px 10px"
    }
});

export default function IndividualConstraint(props) {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);

    return (
        <FormGroup>
            <FormControlLabel
                control={
                        <Checkbox
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                        />
                    } 
                label={props.constraint}
            />
        </FormGroup>
    );

}