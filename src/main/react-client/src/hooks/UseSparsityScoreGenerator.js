import { useEffect, useState } from "react";

export default function UseSparsityScoreGenerator() {
    const [sparsityData, setSparsityData] = useState();

    const url = 'http://localhost:5000/sparsityScores';

    useEffect(() => {
        let tempArray = [];
        (async => {
            fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('The stream is done.');
                    setSparsityData(tempArray);
                    break;
                }
                else {
                    try {
                        const response = JSON.parse(new TextDecoder().decode(value));
                        tempArray.push(response);
                    } catch(err){}
                }
            }
            });
        })();
    }, []);

    return { sparsityData }

}