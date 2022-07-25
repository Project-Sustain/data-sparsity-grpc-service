import { useEffect, useState } from "react";

export default function UseSparsityScoreGenerator(setSelectedIndex) {
    const [sparsityData, setSparsityData] = useState([]);

    const url = 'http://localhost:5000/sparsityScores';

    useEffect(() => {
        console.log("useEffect in SparsityScore hook")
        // let index = 0;
        let streamedResults = [];

        // await fetch(url).then(response => {
        //     reader = response.body.getReader();
        // });
        // myAsyncIterator = await createIterator(reader);
        // for await (const feature of myAsyncIterator){
        //     console.log({feature})
        // }

        fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    const formattedResults = formatResults(streamedResults);
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

    return { sparsityData }

}