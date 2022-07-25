import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import moment from 'moment';
import { makeStyles } from "@material-ui/core";
import { FormControlLabel, FormGroup, Typography } from '@mui/material';

const useStyles = makeStyles({
    root: {
        // margin: "0px 10px"
    }
});

export default function TemporalSlider(props) {
    const classes = useStyles();
    const [value, setValue] = useState([]);

    useEffect(() => {
        setValue([props.min, props.max])
    }, [props.min, props.max]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function valueText(value) {
        return moment.unix(value/1000).format('MM/DD/YYYY');
    }

  if(props.min && props.max) {
    return (
        <>
            <Typography align='center'>Select Date Range {valueText(value[0])} - {valueText(value[1])}</Typography>
            <Slider
                className={classes.root}
                min={props.min}
                max={props.max}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                disableSwap
                getAriaValueText={valueText}
                valueLabelFormat={valueText}
                step={1000*60*24}
            />
        </>
    );
  }
  else return null;
}