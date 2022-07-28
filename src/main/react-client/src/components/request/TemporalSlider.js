import Slider from '@mui/material/Slider';
import moment from 'moment';
import { Typography } from '@mui/material';


export default function TemporalSlider(props) {
    const handleChange = (event, newValue) => {
        props.setTemporalRange(newValue);
    };

    function valueText(value) {
        return moment.unix(value/1000).format('MM/DD/YYYY');
    }

  if(props.temporalRange.length > 0 && props.min && props.max) {
    return (
        <>
            <Typography align='center'>Select Date Range {valueText(props.temporalRange[0])} - {valueText(props.temporalRange[1])}</Typography>
            <Slider
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