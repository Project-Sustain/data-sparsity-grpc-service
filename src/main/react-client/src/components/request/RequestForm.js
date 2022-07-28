import { useState, useEffect, memo } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import { sendJsonRequest } from '../../helpers/api';
import { sparsityMetadata } from '../../library/metadata';
import { Modal } from '@mui/material';
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';
import TemporalSlider from './TemporalSlider';
import DataConstraints from './DataConstraints';
import CollectionSelector from './CollectionSelecter';
import SubmitButton from './SubmitButton';

export default memo(function RequestForm(props) {

    const [stateInfo, setStateInfo] = useState([]);
    const [firstTime, setFirstTime] = useState();
    const [lastTime, setLastTime] = useState();
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});
    const [dataConstraints, setDataConstraints] = useState([]);

    const [collection, setCollection] = useState({});
    const [spatialScope, setSpatialScope] = useState("COUNTY");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [temporalRange, setTemporalRange] = useState([]);
    const [selectedConstraints, setSelectedConstraints] = useState([]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };


    useEffect(() => {
        console.log("useEffect() doing initual setup based off of imported gis & metadata file.");
        setStateInfo(gisStateCounty);
        setSelectedState(gisStateCounty[0]);
        setSelectedCounty(gisStateCounty[0].counties[0]);
        setSpatialIdentifier(gisStateCounty[0].GISJOIN);
        setCollection(sparsityMetadata[0]);
    }, []);
    
    useEffect(() => {
        console.log("useEffect() setting spatialIdentifier when state, county, or scope changes.")
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

    useEffect(() => {
        (async () => {
            console.log("async useEffect() setting dataConstraints when the collection changes.")
            const collectionName = collection.collection;
            const params = {'collectionName': collectionName}
            const response = await sendJsonRequest("measurementTypes", params);
            if(response) {
                setDataConstraints(response.measurementTypes);
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, [collection]);

    useEffect(() => {
        (async () => {
            console.log("async useEffect() setting temporalRange, firstTime, lastTime when collection changes.")
            const collectionName = collection.collection;
            const params = {'collectionName': collectionName}
            const response = await sendJsonRequest("temporalRange", params);
            if(response) {
                const first = parseInt(response.firstTime);
                const last = parseInt(response.lastTime);
                setFirstTime(first);
                setLastTime(last);
                setTemporalRange([first, last]);
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, [collection]);

    const updateSelectedState = (event) => {
        const newState = event.target.value;
        setSelectedState(newState);
        setSelectedCounty(newState.counties[0]);
    }
    
    const updateSelectedCounty = (event) => {
        setSelectedCounty(event.target.value);
    }

    console.log("Request Form Re-Rendering")
    if(stateInfo.length > 0) {
        return (
            <>
                <CollectionSelector
                    setCollection={setCollection}
                    sparsityMetadata={sparsityMetadata}
                    collection={collection}
                />
                <SpatialRadios
                    spatialScope={spatialScope}
                    setSpatialScope={setSpatialScope}
                />
                <SpatialDropdown
                    disabled={false}
                    options={stateInfo}
                    label='State'
                    update={updateSelectedState}
                    value={selectedState}
                />
                <SpatialDropdown
                    disabled={spatialScope != 'COUNTY'}
                    options={selectedState.counties}
                    label='County'
                    update={updateSelectedCounty}
                    value={selectedCounty}
                />
                <TemporalSlider
                    min={firstTime}
                    max={lastTime}
                    temporalRange={temporalRange}
                    setTemporalRange={setTemporalRange}
                />
                {/* <DataConstraints
                    selectedConstraints={selectedConstraints}
                    setSelectedConstraints={setSelectedConstraints}
                    dataConstraints={dataConstraints}
                    setDataConstraints={setDataConstraints}
                /> */}
                <SubmitButton 
                    collectionName={collection.collection}
                    spatialScope={spatialScope}
                    spatialIdentifier={spatialIdentifier}
                    startTime={temporalRange[0]}
                    endTime={temporalRange[1]}
                    measurementTypes={selectedConstraints}

                    setRequestPending={props.setRequestPending}
                    setStreamComplete={props.setStreamComplete}
                    sparsityData={props.sparsityData}
                    setSparsityData={props.setSparsityData}
                    setSelectedIndex={props.setSelectedIndex}
                />
            </>
        );
    }

    else return null;
    
})