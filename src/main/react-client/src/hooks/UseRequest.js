import { useState, useEffect } from 'react';
import { sendRequest } from '../helpers/api';

export default function UseRequest() {
    const [firstTime, setFirstTime] = useState(0);
    const [lastTime, setLastTime] = useState(0);
    console.log({firstTime});
    console.log({lastTime});
    // const [allMeasurementTypes, setAllMeasurementTypes] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await sendRequest("temporalRange");
            if(response) {
                setFirstTime(parseInt(response.firstTime));
                setLastTime(parseInt(response.lastTime));
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, []);

    return { firstTime, lastTime };

}