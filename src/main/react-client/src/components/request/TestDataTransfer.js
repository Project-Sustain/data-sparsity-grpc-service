import { useEffect, useState } from 'react';

export default function TestDataTransfer() {

    async function sendTestRequest() {
        const url = "http://127.0.0.1:5000/testDataTransfer"
        const promise = await fetch(url, {
            'method': "POST",
            headers : {
                'Content-Type':'application/json'
            },
            body: JSON.stringify("Potatoes")
        });
        if(promise) {
            return promise.json();
        }
        else return null;
    }

    useEffect(() => {
        (async () => {
            const response = await sendTestRequest();
            if(response) console.log({response})
            else console.log("ERROR sending serverConnection request");
        })();
    }, []);

}