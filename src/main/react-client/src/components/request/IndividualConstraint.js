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

    const handleCheck = () => {
        setChecked(!checked)
        if(props.selectedConstraints.includes(props.constraint)){
            props.setSelectedConstraints(props.selectedConstraints.filter(constraint => {return constraint != props.constraint}))
        }
        else {
            props.setSelectedConstraints([...props.selectedConstraints, props.constraint]);
        }
    }

    return (
        <FormGroup>
            <FormControlLabel
                control={
                        <Checkbox
                            checked={checked}
                            onChange={handleCheck}
                        />
                    } 
                label={props.constraint}
            />
        </FormGroup>
    );

}