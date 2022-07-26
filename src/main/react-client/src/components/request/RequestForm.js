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

    useEffect(() => {
        setCollection(sparsityMetadata[0]);
    });

    useEffect(() => {
        (async () => {
            const response = await sendRequest("measurementTypes"); // FIXME send request params!
            if(response) {
                setDataConstraints(response.measurementTypes);
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, [dataConstraintFilter]);

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


    console.log({dataConstraints})

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
                <FormControl fullWidth className={classes.select}>
                <InputLabel>{collection.collection}</InputLabel>
                <Select
                    value={collection}
                    label={collection.collection}
                    onChange={updateCollection}
                >
                    {
                        sparsityMetadata.map((dataset, index) => {
                            return (
                                <MenuItem key={index} value={dataset}>{dataset.collection}</MenuItem>
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