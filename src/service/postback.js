var axios = require('axios');

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

    return new Promise((resolve, reject) => {
        axios.default.post(URI + `?access_token=${token}`, post, {headers: {"content-type": "application/json"}}).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

module.exports = PostBack;