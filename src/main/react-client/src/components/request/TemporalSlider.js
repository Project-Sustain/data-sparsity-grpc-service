import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import moment from 'moment';
import { makeStyles } from "@material-ui/core";
import { Typography } from '@mui/material';

const useStyles = makeStyles({
    root: {
        // margin: "0px 10px"
    }
});

export default function TemporalSlider(props) {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.setTemporalRange(newValue);
    };

    function valueText(value) {
        return moment.unix(value/1000).format('MM/DD/YYYY');
    }

  if(props.temporalRange.length > 0) {
    return (
        <>
            <Typography align='center'>Select Date Range {valueText(props.temporalRange[0])} - {valueText(props.temporalRange[1])}</Typography>
            <Slider
                className={classes.root}
                min={props.min}
                max={props.max}
                value={props.temporalRange}
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