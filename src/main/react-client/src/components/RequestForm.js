import { useState, useEffect } from 'react';
import { gisStateCounty } from '../library/gisInfo';
import { Checkbox, Select, FormControl, MenuItem, InputLabel, FormControlLabel, FormGroup } from '@mui/material';
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function RequestForm() {
    const classes = useStyles();

    const [collectionName, setCollectionName] = useState("");
    const [spatialScope, setSpatialScope] = useState("");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [dataConstraints, setDataConstraints] = useState([]);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();

    const [stateInfo, setStateInfo] = useState([]);
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});
    const [countyGranularity, setCountyGranularity] = useState(false);


    console.log({stateInfo})

    useEffect(() => {
        setStateInfo(gisStateCounty);
        setSelectedState(gisStateCounty[0]);
        setSelectedCounty(gisStateCounty[0].counties[0]);
        setSpatialScope("STATE");
        setSpatialIdentifier(gisStateCounty[0].GISJOIN);
    }, []);

    useEffect(() => {
        if(countyGranularity) {
            setSpatialScope("COUNTY");
            setSpatialIdentifier(selectedCounty.GISJOIN);
        }
        else {
            setSpatialScope("STATE");
            setSpatialIdentifier(selectedState.GISJOIN);
        }
    }, [selectedState, selectedCounty, countyGranularity]);

    const updateSelectedState = (event) => {
        const value = event.target.value;
        setSelectedState(value);
        setSelectedCounty(value.counties[0]);
    }
    
    const updateSelectedCounty = (event) => {
        setSelectedCounty(event.target.value);
    }

    if(stateInfo.length > 0) {
        return (
            <>
                {spatialSelect(stateInfo.sort((a, b) => {return a.name - b.name}), 'State', updateSelectedState, false)}
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={countyGranularity}
                                onChange={() => setCountyGranularity(!countyGranularity)}
                            />
                        } 
                        label='County Granularity'
                    />
                </FormGroup>
                {spatialSelect(selectedState.counties.sort((a, b) => {return a.name - b.name}), 'County', updateSelectedCounty, !countyGranularity)}
            </>
        );
    }

    else return null;

    function spatialSelect(options, label, update, disable) {
        return (
            <FormControl fullWidth className={classes.select}>
                <InputLabel>{label}</InputLabel>
                <Select
                    disabled={disable}
                    value={selectedCounty}
                    label={label}
                    onChange={update}
                >
                    {
                        options.map((location, index) => {
                            return (
                                <MenuItem key={index} value={location}>{location.name}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
        );
    }
    

}