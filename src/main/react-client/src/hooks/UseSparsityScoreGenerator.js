import { useCallback, useState, useEffect } from 'react';
import  { useStream } from 'react-fetch-streams';

export default function UseSparsityScoreGenerator() {
    const [sparsityScores, setSparsityScores] = useState([]);

    const onNext = useCallback(async stream => {
        try {
            const streamedResult = await stream.json();
        } catch(error) {}
    }, []);

    useStream('http://127.0.0.1:5000/sparsityScores', { onNext });

    return { sparsityScores };
}