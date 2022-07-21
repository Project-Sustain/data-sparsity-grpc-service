
/**
 * 
 * @param {string} endpoint 
 * @returns server response
 */
export async function sendRequest(endpoint) {
    const url = "http://127.0.0.1:5000/"
    const promise = await fetch(url + endpoint);
    if(promise) {
        return promise.json();
    }
    else return null;
}

export async function sendJsonRequest(endpoint) {
    const url = "http://127.0.0.1:5000/"
    const promise = await fetch(url + endpoint, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      });
    if(promise) {
        return promise.json();
    }
    else return null;
}

