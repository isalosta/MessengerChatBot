const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const UserSchema = Schema({
    user_id: String,
    user_name: String,
    step: String,
    birthday: String,
    is_not_first: Boolean
})


module.exports = Mongoose.model("User", UserSchema, "user");
