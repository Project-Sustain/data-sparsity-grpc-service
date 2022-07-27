import { useState, useEffect } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';
import { sendRequest } from '../../helpers/api';
import TemporalSlider from './TemporalSlider';
import DataConstraints from './DataConstraints';
import { sparsityMetadata } from '../../library/metadata';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from "@material-ui/core";
import TestDataTransfer from './TestDataTransfer';

const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function RequestForm() {
    const classes = useStyles();

    const [stateInfo, setStateInfo] = useState([]);
    const [firstTime, setFirstTime] = useState();
    const [lastTime, setLastTime] = useState();
    const [dataConstraints, setDataConstraints] = useState([]);
    const [dataConstraintFilter, setDataConstraintFilter] = useState("");
    const [collection, setCollection] = useState({});
    const [spatialScope, setSpatialScope] = useState("STATE");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});

    const sendTemporalRangeRequest = () => {
        const collectionName = collection.collection;
    }

    const sendMeasurementTypesRequest = () => {
        const collectionName = collection.collection;
        const filter = dataConstraintFilter;
    }

    useEffect(() => {
        setCollection(sparsityMetadata[0]);
    }, [sparsityMetadata]);

    useEffect(() => {
        (async () => {
            const collectionName = collection.collection;
            const body = {
                'method': "POST",
                headers : {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({'collectionName': collectionName, 'filter': dataConstraintFilter})
            }
            const response = await sendRequest("measurementTypes", body);
            if(response) {
                setDataConstraints(response.measurementTypes);
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, [dataConstraintFilter, collection]);

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

    const updateCollection = (event) => {
        setCollection(event.target.value);
    }

    if(stateInfo.length > 0) {
        return (
            <>
                <TestDataTransfer />
                <FormControl fullWidth className={classes.select}>
                    <InputLabel>Dataset</InputLabel>
                    <Select
                        value={collection}
                        label="Dataset"
                        onChange={updateCollection}
                    >
                        {
                            sparsityMetadata.map((dataset, index) => {
                                return (
                                    <MenuItem key={index} value={dataset}>{dataset.label}</MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
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
                <DataConstraints setDataConstraints={setDataConstraints} dataConstraints={dataConstraints} />
            </>
        );
    }

    else return null;
    
}