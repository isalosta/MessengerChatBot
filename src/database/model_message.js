const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const MessageSchema = Schema({
    user_id: String,
    user_name: String,
    text: String,
    date: String
})


module.exports = Mongoose.model("Message", MessageSchema, "message");