import { useState, useEffect, memo } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import { sendJsonRequest } from '../../helpers/api';
import { sparsityMetadata } from '../../library/metadata';
import { Paper, Typography } from '@mui/material';
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';
import TemporalSlider from './TemporalSlider';
import CollectionSelector from './CollectionSelecter';
import SubmitButton from './SubmitButton';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    paper: {
        margin: "10px",
        padding: "10px",
        overflow: "auto"
    },
    select: {
        margin: '10px 0px'
    }
  });

export default memo(function RequestForm(props) {
    const classes = useStyles();

    const [stateInfo, setStateInfo] = useState([]);
    const [firstTime, setFirstTime] = useState();
    const [lastTime, setLastTime] = useState();
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});
    // const [dataConstraints, setDataConstraints] = useState([]);

    const [collection, setCollection] = useState({});
    const [spatialScope, setSpatialScope] = useState("COUNTY");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [temporalRange, setTemporalRange] = useState([]);
    // const [selectedConstraints, setSelectedConstraints] = useState([]);
    const selectedConstraints = [];

    useEffect(() => {
        setStateInfo(gisStateCounty);
        setSelectedState(gisStateCounty[0]);
        setSelectedCounty(gisStateCounty[0].counties[0]);
        setSpatialIdentifier(gisStateCounty[0].GISJOIN);
        setCollection(sparsityMetadata[0]);
    }, []);
    
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

    // useEffect(() => {
    //     (async () => {
    //         const collectionName = collection.collection;
    //         const params = {'collectionName': collectionName}
    //         const response = await sendJsonRequest("measurementTypes", params);
    //         if(response) {
    //             setDataConstraints(response.measurementTypes);
    //         }
    //         else console.log("ERROR sending serverConnection request");
    //     })();
    // }, [collection]);

    useEffect(() => {
        (async () => {
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

    if(stateInfo.length > 0) {
        return (
            <Paper elevation={3} className={classes.paper}>
                <Typography align='center' variant='h5'>Data Request Form</Typography>
                <CollectionSelector
                    className={classes.select}
                    setCollection={setCollection}
                    sparsityMetadata={sparsityMetadata}
                    collection={collection}
                />
                <SpatialRadios
                    spatialScope={spatialScope}
                    setSpatialScope={setSpatialScope}
                />
                <SpatialDropdown
                    className={classes.select}
                    disabled={false}
                    options={stateInfo}
                    label='State'
                    update={updateSelectedState}
                    value={selectedState}
                />
                <SpatialDropdown
                    className={classes.select}
                    disabled={spatialScope !== 'COUNTY'}
                    options={selectedState.counties.sort((a, b) => {return a.collection - b.collection})}
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
            </Paper>
        );
    }

    else return null;
    
})