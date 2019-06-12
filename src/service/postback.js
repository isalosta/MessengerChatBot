var Axios = require('axios');

let URI = "https://graph.facebook.com/v3.3/me/messages?"

let PostBack = (token, recipient, msg) => {
    let post = {
        recipient: {
            id: recipient
        },
        message: {
            text: msg
        }
    }

    console.log(URI, post);

    return new Promise((resolve, reject) => {
        Axios.default.post(URI + `access_token=${token}`, post, {headers: {"Content-Type": "application/json"}}).then(res => {
            resolve(res);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
}

module.exports = PostBack;