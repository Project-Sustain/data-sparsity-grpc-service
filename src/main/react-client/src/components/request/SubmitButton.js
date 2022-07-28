import { Button } from '@mui/material';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        width: '100%'
    }
});

export default function SubmitButton(props) {
    const classes = useStyles();

    const sendSparsityScoreRequest = async() => {

        props.setStreamComplete(false);
        props.setRequestPending(true);

        const params = {
            'collectionName': props.collectionName,
            'spatialScope': props.spatialScope,
            'spatialIdentifier': props.spatialIdentifier,
            'startTime': props.startTime,
            'endTime': props.endTime,
            'measurementTypes': props.measurementTypes
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
                    console.log("formattedResults.length: " + formattedResults.length)
                    props.setSparsityData(formattedResults);
                    props.setSelectedIndex(0);
                    props.setStreamComplete(true);
                    props.setRequestPending(false);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        response.sparsityScore = response.sparsityScore ? parseFloat((response.sparsityScore).toFixed(3)) : 0;
                        streamedResults.push(response);
                        props.setSparsityData([...props.sparsityData, response]);
                    } catch(err){
                        console.log("Error while streaming "+ err);
                    }
                }
            }

            function checkMessage() {
                let incompleteResponse  = ""

                while(true){

                    let response = new TextDecoder().decode(value);
                        response = incompleteResponse + response;

                    while(response.indexOf('\n') !== -1) {
                        const parsedResponse = response.substring(0, response.indexOf('\n'));
                        const obj = JSON.parse(parsedResponse);
                        response = response.substring(response.indexOf('\n') + 1, response.length);
                        yield obj

                        if(response.indexOf('\n') === -1 && response.length !== 0){
                            incompleteResponse = response;
                        }
                        else{
                            incompleteResponse = "";
                        }

                    }
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

    return <Button className={classes.root} variant='outlined' onClick={sendSparsityScoreRequest}>Submit Request</Button>
}