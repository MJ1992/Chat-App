var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

});

UserSchema.virtual('status').get(function() {
    return this._status;
});

UserSchema.virtual('status').set(function(status) {
    return this._status = status;
});

UserSchema.set('toObject', {
    getters: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);