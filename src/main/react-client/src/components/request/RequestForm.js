import { useState, useEffect } from 'react';
import { gisStateCounty } from '../../library/gisInfo';
import SpatialDropdown from './SpatialDropdown';
import SpatialRadios from './SpatialRadios';
import { sendJsonRequest } from '../../helpers/api';
import TemporalSlider from './TemporalSlider';
import DataConstraints from './DataConstraints';
import { sparsityMetadata } from '../../library/metadata';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function RequestForm(props) {
    const classes = useStyles();

    const [stateInfo, setStateInfo] = useState([]);
    const [firstTime, setFirstTime] = useState();
    const [lastTime, setLastTime] = useState();
    const [dataConstraints, setDataConstraints] = useState([]);
    const [collection, setCollection] = useState({});
    const [spatialScope, setSpatialScope] = useState("STATE");
    const [spatialIdentifier, setSpatialIdentifier] = useState("");
    const [selectedState, setSelectedState] = useState({});
    const [selectedCounty, setSelectedCounty] = useState({});
    const [temporalRange, setTemporalRange] = useState([]);
    const [selectedConstraints, setSelectedConstraints] = useState([]);

    useEffect(() => {
        setCollection(sparsityMetadata[0]);
    }, [sparsityMetadata]);

    useEffect(() => {
        (async () => {
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
        if(firstTime && lastTime) {
            setTemporalRange([firstTime, lastTime])
        }
    }, [firstTime, lastTime]);

    useEffect(() => {
        (async () => {
            const collectionName = collection.collection;
            const params = {'collectionName': collectionName}
            const response = await sendJsonRequest("temporalRange", params);
            if(response) {
                setFirstTime(parseInt(response.firstTime));
                setLastTime(parseInt(response.lastTime));
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, [collection]);

    useEffect(() => {
        setStateInfo(gisStateCounty);
        setSelectedState(gisStateCounty[0]);
        setSelectedCounty(gisStateCounty[0].counties[0]);
        setSpatialIdentifier(selectedState.GISJOIN);
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

    const sendSparsityScoreRequest = async() => {

        const params = {
            'collectionName': collection.collection,
            'spatialScope': spatialScope,
            'spatialIdentifier': spatialIdentifier,
            'startTime': temporalRange[0],
            'endTime': temporalRange[1],
            'measurementTypes': selectedConstraints
        };

        const body = {
            'method':'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(params)
        };

        const url = "http://127.0.0.1:5000/sparsityScores";

        let streamedResults = [];

        fetch(url, body).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    const formattedResults = formatResults(streamedResults);
                    console.log({formattedResults})
                    props.setSparsityData(formattedResults);
                    props.setSelectedIndex(formattedResults.length-1);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        response.sparsityScore = response.sparsityScore ? parseFloat((response.sparsityScore).toFixed(3)) : 0;
                        streamedResults.push(response);
                    } catch(err){}
                }
            }

            function formatResults(streamedResults) {
                streamedResults.sort((a, b) => {return b.sparsityScore - a.sparsityScore});
                const scoresList = [...new Set(streamedResults.map(result => {return result.sparsityScore}))];
                const numberOfUniqueScores = scoresList.length - 1;
                const scoreMap = {};
                scoresList.forEach((absoulteScore, index) => {
                    scoreMap[absoulteScore] = parseInt(((numberOfUniqueScores - index) / numberOfUniqueScores) * 100) + "%";
                });
                const formattedResults = streamedResults.map(result => {
                    result.relativeSparsityScore = scoreMap[result.sparsityScore];
                    return result
                });
                return formattedResults;
            }
        });



            
    }

    if(stateInfo.length > 0) {
        return (
            <>
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
                    temporalRange={temporalRange}
                    setTemporalRange={setTemporalRange}
                />
                <DataConstraints
                    selectedConstraints={selectedConstraints}
                    setSelectedConstraints={setSelectedConstraints}
                    dataConstraints={dataConstraints}
                    setDataConstraints={setDataConstraints}
                />
                <Button
                    variant='outlined'
                    onClick={sendSparsityScoreRequest}
                >Submit Request</Button>
            </>
        );
    }

    else return null;
    
}