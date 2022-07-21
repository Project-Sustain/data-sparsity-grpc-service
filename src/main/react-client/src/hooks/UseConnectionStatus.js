import {useState, useEffect} from 'react'

export default function UseConnectionStatus() {
    const [serverConnection, setServerConnection] = useState(false);
    const [DbConnection, setDbConnection] = useState(false);

    async function sendConnectionRequest() {
        const promise = await fetch("http://127.0.0.1:5000/connections");
        if(promise) {
            return promise.json();
        }
        else return null;
    }

    useEffect(() => {
        (async () => {
            const response = await sendConnectionRequest();
            if(response) {
                setServerConnection(response[0]);
                setDbConnection(response[1]);
            }
            else console.log("ERROR")
        })();
    }, []);

    return {serverConnection, DbConnection}
}