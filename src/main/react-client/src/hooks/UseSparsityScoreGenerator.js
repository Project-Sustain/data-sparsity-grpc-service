import { useEffect, useState } from "react";

export default function UseSparsityScoreGenerator(setSelectedIndex) {
    const [sparsityData, setSparsityData] = useState([]);

    const url = 'http://localhost:5000/sparsityScores';

    useEffect(() => {
        console.log("useEffect in SparsityScore hook")
        // let index = 0;
        let streamedResults = [];
        fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    streamedResults.sort((a, b) => {return b.sparsityScore - a.sparsityScore});

                    // FIXME add the relative score on the server? Not possible if we stream...possible if we don't
                    const scoresList = [...new Set(streamedResults.map(result => {return result.sparsityScore}))];
                    const numberOfUniqueScores = scoresList.length - 1;
                    const scoreMap = {};
                    scoresList.forEach((score, index) => {
                        scoreMap[score] = parseInt(((numberOfUniqueScores - index) / numberOfUniqueScores) * 100) + "%";
                    });
                    const formattedResults = streamedResults.map(result => {
                        result.relativeSparsityScore = scoreMap[result.sparsityScore];
                        return result
                    });

                    setSparsityData(formattedResults);
                    setSelectedIndex(formattedResults.length-1);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        response.sparsityScore = response.sparsityScore ? parseFloat((response.sparsityScore).toFixed(3)) : 0;
                        streamedResults.push(response);
                        // FIXME to get results back in a stream, do something like this
                        // if(index % 100 === 0) {
                        //     await new Promise(r => setTimeout(r, 50));
                        //     setSparsityData(streamedResults);
                        //     setSelectedIndex(index);
                        // }
                    } catch(err){}
                }
                // index++;
            }
        });
    }, [setSelectedIndex]);

    return { sparsityData }

}