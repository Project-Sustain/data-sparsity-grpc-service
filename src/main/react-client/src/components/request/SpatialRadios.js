import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';

export default function SpatialRadios(props) {

    const updateSpatialScope = (event) => {
        props.setSpatialScope(event.target.value);
    }

    return (
        <FormControl>
            <FormLabel id="spatial-scope">Spatial Scope</FormLabel>
            <RadioGroup
                row
                aria-labelledby="spatial-scope"
                value={props.spatialScope}
                onChange={updateSpatialScope}
            >
                <FormControlLabel disabled={true} value="COUNTRY" control={<Radio />} label="Country" />
                <FormControlLabel value="STATE" control={<Radio />} label="State" />
                <FormControlLabel value="COUNTY" control={<Radio />} label="County" />
                <FormControlLabel disabled={true} value="SITE" control={<Radio />} label="Site" />
            </RadioGroup>
        </FormControl>
    );
    
}