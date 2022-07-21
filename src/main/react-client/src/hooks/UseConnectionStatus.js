import { useState, useEffect } from 'react';
import { sendRequest } from '../helpers/api';

export default function UseConnectionStatus() {
    const [serverConnection, setServerConnection] = useState(false);
    const [DbConnection, setDbConnection] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await sendRequest("serverConnection");
            if(response) {
                setServerConnection(response);
            }
            else console.log("ERROR sending serverConnection request");
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await sendRequest("dbConnection");
            if(response) {
                setDbConnection(response);
            }
            else console.log("ERROR sending dbConnection request");
        })();
    }, []);

    return { serverConnection, DbConnection };
}