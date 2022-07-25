import { useState, useEffect } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import {  } from '@mui/material';
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';
import UseRequest from '../../hooks/UseRequest';
import { sendRequest } from '../../helpers/api';
import TemporalSlider from './TemporalSlider';


export default function RequestForm() {

    const { startTime, endTime } = UseRequest();
    console.log({startTime})
    console.log({endTime})

    const [firstTime, setFirstTime] = useState();
    const [lastTime, setLastTime] = useState();

    useEffect(() => {
        (async () => {
            const response = await sendRequest("temporalRange");
            if(response) {
                setFirstTime(parseInt(response.firstTime));
                setLastTime(parseInt(response.lastTime));
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, []);

    console.log({firstTime})
    console.log({lastTime})

    // const [collectionName, setCollectionName] = useState("");
    const [spatialScope, setSpatialScope] = useState("STATE");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    // const [dataConstraints, setDataConstraints] = useState([]);

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
                <TemporalSlider
                    min={firstTime}
                    max={lastTime}
                />
            </>
        );
    }

    else return null;
    
}