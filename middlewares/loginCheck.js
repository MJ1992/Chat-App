var passport = require('passport');

var middlewareObj = {};

//function to check if user is logged in or not using passport js isAuthenticated method
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    } else {
        //req.flash('error', 'You need to login first!');
        res.redirect('/login');
    }

};

module.exports = middlewareObj;