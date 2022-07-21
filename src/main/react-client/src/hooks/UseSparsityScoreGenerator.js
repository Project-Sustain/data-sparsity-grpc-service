import { useCallback, useState, useEffect } from 'react';
import { sendJsonRequest } from '../helpers/api';
import  { useStream } from 'react-fetch-streams';

export default function UseSparsityScoreGenerator() {
    const [sparsityScores, setSparsityScores] = useState({});

    // let streamedResults = [];
    const onNext = useCallback(async res => {
        const data = await res.json();
        // streamedResults.push(data['siteSparsityScores']);
    }, []);
    useStream('http://127.0.0.1:5000//sparsityScores', { onNext });
    // console.log({streamedResults})
    // setSparsityScores(streamedResults);

    return { sparsityScores };
}