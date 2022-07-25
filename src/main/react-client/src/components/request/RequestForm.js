import { useState, useEffect } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import {  } from '@mui/material';
import { makeStyles } from "@material-ui/core";
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';


const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function RequestForm() {
    const classes = useStyles();

    const [collectionName, setCollectionName] = useState("");
    const [spatialScope, setSpatialScope] = useState("STATE");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [dataConstraints, setDataConstraints] = useState([]);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();

    const [stateInfo, setStateInfo] = useState([]);
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});

    console.log({spatialScope})
    console.log({spatialIdentifier})

    useEffect(() => {
        setStateInfo(gisStateCounty);
        setSelectedState(gisStateCounty[0]);
        setSelectedCounty(gisStateCounty[0].counties[0]);
        setSpatialIdentifier(selectedState.GISJOIN);
    }, [selectedState.GISJOIN]);

    useEffect(() => {
        switch(spatialScope) {
            case "COUNTRY":
                setSpatialIdentifier("");
                break;
            case "STATE":
                setSpatialIdentifier(selectedState.GISJOIN);
                break;
            case "COUNTY":
                setSpatialIdentifier(selectedCounty.GISJOIN);
                break;
            case "SITE":
                setSpatialIdentifier(""); // FIXME eventually this is a monitorId?
                break;
            default:
                break;                
        }
    }, [selectedState, selectedCounty, spatialScope]);

    const updateSelectedState = (event) => {
        setSelectedState(event.target.value);
        setSelectedCounty(event.target.value.counties[0]);
    }
    
    const updateSelectedCounty = (event) => {
        setSelectedCounty(event.target.value);
    }

    const updateSpatialScope = (event) => {
        setSpatialScope(event.target.value);
    }

    if(stateInfo.length > 0) {
        return (
            <>
                <SpatialRadios
                    spatialScope={spatialScope}
                    updateSpatialScope={updateSpatialScope}
                />
                <SpatialDropdown
                    options={stateInfo.sort((a, b) => {return a.name - b.name})}
                    label='State'
                    update={updateSelectedState}
                    value={selectedState}
                />
                <SpatialDropdown
                    options={selectedState.counties.sort((a, b) => {return a.name - b.name})}
                    label='County'
                    update={updateSelectedCounty}
                    value={selectedCounty}
                />
            </>
        );
    }

    else return null;
    
}