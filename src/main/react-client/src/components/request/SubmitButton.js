import { Button } from '@mui/material';

export default function SubmitButton(props) {

    const sendSparsityScoreRequest = async() => {

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

    return <Button  variant='outlined' onClick={sendSparsityScoreRequest}>Submit Request</Button>
}