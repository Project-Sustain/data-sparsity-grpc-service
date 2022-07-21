import {useState, useEffect} from 'react'

export default function UseConnectionStatus() {
    const [serverConnection, setServerConnection] = useState(false);
    const [DbConnection, setDbConnection] = useState(false);

    async function sendConnectionRequest(endpoint) {
        const promise = await fetch("http://127.0.0.1:5000/" + endpoint);
        if(promise) {
            return promise.json();
        }
        else return null;
    }

    useEffect(() => {
        (async () => {
            const response = await sendConnectionRequest("serverConnection");
            if(response) {
                setServerConnection(response);
            }
            else console.log("ERROR")
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await sendConnectionRequest("dbConnection");
            if(response) {
                setDbConnection(response);
            }
            else console.log("ERROR")
        })();
    }, []);

    return {serverConnection, DbConnection}
}