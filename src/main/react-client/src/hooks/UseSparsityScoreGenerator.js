import { useState, useEffect } from 'react';
import { sendJsonRequest } from '../helpers/api';

export default function UseSparsityScoreGenerator() {
    const [sparsityScores, setSparsityScores] = useState();

    useEffect(() => {
        (async () => {
            const response = await sendJsonRequest("sparsityScores");
            if(response) {
                setSparsityScores(JSON.stringify(response));
            }
            else console.log("ERROR sending sparsityScore request")
        })();
    }, []);

    return { sparsityScores };
}