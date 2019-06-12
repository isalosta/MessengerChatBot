
const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const DotEnv = require('dotenv');
const Request = require('request');

DotEnv.config({path: `${__dirname}/.env`});

const app = Express();
var db = Mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});


app.use(BodyParser.json());

app.post("/webhook", (req, res) => {
    console.log(req);
});

app.get("/webhook", (req, res) => {
    console.log(req, res);
})

app.get("/messages/:id", async(req, res, next) => {
    console.log(req, res);
});

app.get("/messages/delete/:id", async(req, res, next) => {
    console.log(req, res);
})

app.listen(process.env.port || 8080, () => {console.log(`Server RUN on ${process.env.port || 8080}`)});