import { useEffect, useState } from "react";

export default function UseSparsityScoreGenerator() {
    const [sparsityData, setSparsityData] = useState([]);

    const url = 'http://localhost:5000/sparsityScores';

    useEffect(() => {
        let streamedResults = [];
        fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // setSparsityData(streamedResults);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        streamedResults.push(response);
                        setSparsityData(streamedResults);
                    } catch(err){}
                }
            }
        });
    }, []);

    return { sparsityData }

}