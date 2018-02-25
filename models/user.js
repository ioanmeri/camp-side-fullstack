var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, require: true},
    passport: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, require: true},
    city: String,
    birthday: String,
    bio: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);