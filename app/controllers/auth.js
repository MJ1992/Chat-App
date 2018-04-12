var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var middlewareObj = require('../../middlewares/loginCheck');



module.exports.controller = function(app) {

    router.get('/', middlewareObj.isLoggedIn, function(req, res) {
        res.render('index', { currentUser: req.user });

    });



    //show sign up form
    router.get('/register', function(req, res) {
        res.render('register');
    });

    //handling user sign up
    router.post('/register', function(req, res) {


        User.register(new User({
            username: req.body.username,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
        }), req.body.password, function(err, user) {
            if (err) {

                console.log(err.message);
                req.flash('error', err.message);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, function() {
                    req.session.user = user;
                    req.flash('success', "Welcome," + user.username);
                    res.redirect('/');
                });

            }

        });
    });

    //Login Route

    //show login form
    router.get('/login', function(req, res) {
        res.render('login');
    });

    //handling user login
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Welcome! to MeChat'
    }), function(req, res) {


    });

    //logOut

    router.get('/logout', function(req, res) {

        req.logout();
        req.flash('success', 'Successfully logged you out !!');
        res.redirect('login');
    });

    //Forgot password functionality
    router.get('/forgot', function(req, res) {
        res.render('forgot');
    });

    router.post('/forgot', function(req, res, next) {
        async.waterfall([
                //generate a random token
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },

                function(token, done) {
                    //finding the associated user in database with  email
                    User.findOne({ email: req.body.email }, function(err, user) {
                        if (!user) {
                            req.flash('error', 'No account found with that email address');
                            return res.redirect('/forgot');
                        }
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000;

                        user.save(function(err) {
                            done(err, token, user);
                        });

                    });
                },

                function(token, user, done) {

                    //mail thingy here
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: "mj8246164@gmail.com", //  user
                            pass: "nodemailtest" //  password
                        }
                    });

                    // setup email data with unicode symbols
                    var mailOptions = {
                        to: user.email,
                        from: 'mj8246164@gmail.com',
                        subject: 'MeChat Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to reset your password:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please feel free to ignore this email and your password will remain unchanged.\n\n' +
                            'Thanks, \n' + 'The MeChat Team'
                    };
                    transporter.sendMail(mailOptions, function(err) {
                        console.log('mail sent');
                        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, 'done');
                    });
                }
            ],
            function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/forgot');
            });

    });

    //Reset password page

    router.get('/reset/:token', function(req, res) {
        //find user with reset token in db
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Passord token is invalid or has expired');
                return res.redirect('/forgot');

            }
            res.render('resetPassword', { token: req.params.token });
        });
    });

    router.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Passord token is invalid or has expired');
                        return res.redirect('/forgot');
                    }
                    if (req.body.password === req.body.confirm) {
                        user.setPassword(req.body.password, function(err) {
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;

                            user.save(function(err) {
                                req.logIn(user, function(err) {
                                    done(err, user);
                                });
                            });
                        });
                    } else {
                        req.flash('error', 'Password do not match');
                        return res.redirect('/resetPassword');
                    }
                });
            },

            function(user, done) {

                //mail thingy here
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "mj8246164@gmail.com", //  user
                        pass: "nodemailtest" //  password
                    }
                });

                // setup email data with unicode symbols
                var mailOptions = {
                    to: user.email,
                    from: 'mj8246164@gmail.com',
                    subject: 'Password Reset Confirmation',
                    text: 'Hello, \n\n' +
                        'This is a confirmation that password for your account ' + user.email + ' has been changed successfully.'
                };
                transporter.sendMail(mailOptions, function(err) {
                    console.log('mail sent');
                    req.flash('success', 'Success, your password has been changed!!');
                    done(err);
                });
            }


        ], function(err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/');
            }
        });
    });
    app.use('/', router);

};