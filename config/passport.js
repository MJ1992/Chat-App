var LocalStrategy = require('passport-local'),
    GoogleStrategy = require('passport-google-oauth2'),
    User = require('../app/models/user');

module.exports = function(passport) {


    //local strategy    
    passport.use(new LocalStrategy(User.authenticate()));

    // passport.use(new LocalStrategy(
    //     function(username, password, done) {
    //         User.findOne({ username: username }, function(err, user) {
    //             if (err) { return done(err); }
    //             if (!user) {
    //                 return done(null, false, { message: 'Incorrect username.' });
    //             }
    //             if (!user.validPassword(password)) {
    //                 return done(null, false, { message: 'Incorrect password.' });
    //             }
    //             return done(null, user);
    //         });
    //     }
    // ));


    // passport.serializeUser(User.serializeUser());
    // passport.deserializeUser(User.deserializeUser());
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

};