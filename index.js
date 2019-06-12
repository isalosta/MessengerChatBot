
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
    console.log(req);
    res.send({status: "OK"});
});

app.get("/webhook", (req, res) => {
    console.log(req, res);
    res.send({status: "OK"});
})

app.get("/messages/:id", async(req, res, next) => {
    console.log(req, res);
});

app.get("/messages/delete/:id", async(req, res, next) => {
    console.log(req, res);
})

app.listen(process.env.PORT || 8080, () => {console.log(`Server RUN on ${process.env.PORT}`)});