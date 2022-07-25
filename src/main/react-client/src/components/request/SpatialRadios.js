import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';

export default function SpatialRadios(props) {
    // const classes = useStyles();

    return (
        <FormControl>
            <FormLabel id="spatial-scope">Spatial Scope</FormLabel>
            <RadioGroup
                row
                aria-labelledby="spatial-scope"
                value={props.spatialScope}
                onChange={props.updateSpatialScope}
            >
                <FormControlLabel value="COUNTRY" control={<Radio />} label="Country" />
                <FormControlLabel value="STATE" control={<Radio />} label="State" />
                <FormControlLabel value="COUNTY" control={<Radio />} label="County" />
                <FormControlLabel value="SITE" control={<Radio />} label="Site" />
            </RadioGroup>
        </FormControl>
    );
    
}