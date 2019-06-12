


const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const DotEnv = require('dotenv');
const Request = require('request');

DotEnv.config({path: `${__dirname}/.env`});


const app = Express();
Mongoose.connect(encodeURI(process.env.MONGO_URI)).then(res => {
    console.log("[MongoDB] >>> Connected");
}).catch(err => {
    console.log("CONN ERR >>> ", process.env.MONGO_URI);
    console.log("DETAILS ERR", err);
});


app.use(BodyParser.json());

app.post("/webhook", (req, res) => {
    console.log(">>>> EVENT RECIEVED");
    res.status(200).send("EVENT RECIEVED");

    let body = req.body;
    let entry = body.entry;

    console.log(body);
    
    if(entry) {
        let len = entry.length;
        if(body.object === 'page') {
            if(len <= 0) {
                return;
            }
        }

        for(let i = 0; i < len; i++) {
            console.log(body.entry[i]);
        }

    } else {
        return;
    }
});

app.get("/webhook", (req, res) => {
    let verify_token = process.env.VERIFICATION_TOKEN;
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token) {
        if(mode === "subscribe") {
            if (token === verify_token) {
                console.log(" >>>> Verified !");
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
})

app.get("/messages/:id", async(req, res, next) => {
    console.log(req, res);
});

app.get("/messages/delete/:id", async(req, res, next) => {
    console.log(req, res);
});

app.get("/privacy_policy", (req, res) => {
    res.sendFile('src/views/privacy_policy.html', {root: __dirname })
})

app.listen(process.env.PORT || 8080, () => {console.log(`Server RUN on ${process.env.PORT}`)});