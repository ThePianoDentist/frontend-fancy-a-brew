import { Notify } from 'quasar';
export async function postRequest(url, data){
    console.log("post request:", url, data)
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    if (content.status === "error"){
        Notify.create({
            color: 'red',
            textColor: 'white',
            //icon: 'cloud_done',
            //icon: 'grin-alt',
            message: content.error
        })
        return;
    }
    return content.data;
}