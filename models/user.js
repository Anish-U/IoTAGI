var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportLocalMongoose); //add bunch of packages from passport-local-mongoose to userSchema
module.exports = mongoose.model("User", UserSchema);