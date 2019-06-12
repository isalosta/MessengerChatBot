


const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const DotEnv = require('dotenv');
const Request = require('request');
const Moment = require('moment');

const UserModel = require('./src/database/model_user');
const Verbal = require('./src/service/verbal');
const PostBack = require('./src/service/postback');

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
    let type = body.type;

    console.log(body);

    if(type === "message") {
        UserModel.find({user_id: body.from.id}).then(res => {
            console.log("DB >>> ", res);
            if(res.length > 0) {
                let dt = res[0];
                let step = parseInt(dt.step);
                ProcessMessage(step, body, dt);
            } else {
                PostBack(process.env.ACCESS_TOKEN, body.from.id, "Hello There!").then(res => {
                    console.log("SENT! >>> ", body.from.id);
                    UserModel.create({
                        user_id: body.from.id,
                        user_name: body.from.name,
                        step: "0",
                        is_not_first: false,
                        birthday: new Date.now()
                    }).then(res => {
                        PostBack(process.env.ACCESS_TOKEN, body.from.id, Verbal.Question["0"].text).then(res => {
                            console.log("SENT! >>> ", body.from.id);
                        }).catch(err => {console.log("SENDING FAIL!")});
                    }).catch(err => {console.log("INSERT DB FAIL!")});
                }).catch(err => {console.log("SENDING FAIL!")});
            }
        }).catch(err => {
            console.log(err);
        })
    }
});

function ProcessMessage(step, body, dt) {
    switch(step) {
        case 0:
            UserModel.update({ user_id: body.from.id }, {
                user_id: body.from.id,
                user_name: body.from.name,
                step: "1",
                is_not_first: dt.is_not_first ? true : false,
                birthday: dt.birthday
            }).then(res_ => {
                PostBack(process.env.ACCESS_TOKEN, body.from.id, `Welcome Again ${body.from.name}`).then(res => {
                    console.log("SENT! >>> ", body.from.id);
                }).catch(err_ => { console.log("SENDING FAIL!") });
            });
        break;

        case 1:
            step = step + 1;
            UserModel.update({ user_id: body.from.id }, {
                user_id: body.from.id,
                user_name: body.from.name,
                step: `${step}`,
                is_not_first: dt.is_not_first ? true : false,
                birthday: dt.birthday
            }).then(res_ => {
                PostBack(process.env.ACCESS_TOKEN, body.from.id, Verbal.Question[dt.step].text).then(res => {
                    console.log("SENT! >>> ", body.from.id);
                }).catch(err_ => { console.log("SENDING FAIL!") });
            });
        break;

        case 2:
            step = step + 1;
            UserModel.update({ user_id: body.from.id }, {
                user_id: body.from.id,
                user_name: body.from.name,
                step: `${step}`,
                is_not_first: dt.is_not_first ? true : false,
                birthday: Moment(body.text, "DD/MM/YYYY")
            }).then(res_ => {
                PostBack(process.env.ACCESS_TOKEN, body.from.id, Verbal.Question[dt.step].text).then(res => {
                    console.log("SENT! >>> ", body.from.id);
                }).catch(err_ => { console.log("SENDING FAIL!") });
            });
        break;

        case 3:
            UserModel.update({ user_id: body.from.id }, {
                user_id: body.from.id,
                user_name: body.from.name,
                step: "0",
                is_not_first: true,
                birthday: dt.birthday
            }).then(res_ => {
                let date_now = Moment(new Date.now());
                let date_curr = Moment(dt.birthday);

                PostBack(process.env.ACCESS_TOKEN, body.from.id, Verbal.EndResponse(date_now.diff(date_curr, 'days').toString())[body.text[0] === 'y' ? "y" : "n"].text).then(res => {
                    console.log("SENT! >>> ", body.from.id);
                }).catch(err => { console.log("SENDING FAIL!") });
            });
        break;

        default:
            PostBack(process.env.ACCESS_TOKEN, body.from.id, `We're Apologize ${body.from.name}, Something Went Broken :(`).then(res => {
                console.log("SENT! >>> ", body.from.id);
            }).catch(err_ => { console.log("SENDING FAIL!") });
        break;
    }
}

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