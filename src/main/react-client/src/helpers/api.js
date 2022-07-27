
/**
 * 
 * @param {string} endpoint 
 * @returns server response
 */
export async function sendRequest(endpoint, body) {
    const url = "http://127.0.0.1:5000/"
    const promise = await fetch(url + endpoint, body);
    if(promise) {
        return promise.json();
    }
    else return null;
}
