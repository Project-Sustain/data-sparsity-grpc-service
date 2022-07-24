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
                    setSparsityData(streamedResults);
                    setSelectedIndex(streamedResults.length-1);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        let score = response.sparsityScore ? response.sparsityScore : 0;
                        if(score < 0) score *= -1;
                        response.sparsityScore = score;
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