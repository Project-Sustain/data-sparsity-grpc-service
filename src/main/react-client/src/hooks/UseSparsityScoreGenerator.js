import { useEffect, useState } from "react";

export default function UseSparsityScoreGenerator(setSelectedIndex) {
    const [sparsityData, setSparsityData] = useState([]);

    const url = 'http://localhost:5000/sparsityScores';

    useEffect(() => {
        console.log("useEffect in SparsityScore hook")
        let index = 0;
        let streamedResults = [];
        fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            const { done, value } = await reader.read();
            while (true) {
                if (done) {
                    setSparsityData(streamedResults);
                    setSelectedIndex(streamedResults.length-1);
                    break;
                }
                else {
                    // await new Promise(r => setTimeout(r, 10));
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        streamedResults.push(response);
                        if(index % 10 === 0) {
                            setSparsityData(streamedResults);
                            setSelectedIndex(index);
                        }
                    } catch(err){}
                }
                index++;
            }
        });
    }, [setSelectedIndex]);

    return { sparsityData }

}