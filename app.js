var express = require("express"),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    session = require('express-session'),
    flash = require('connect-flash'),
    http = require('http').Server(app),
    fs = require('fs');



//Using application level middleware BodyParser
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

//logging 
app.use(logger('dev'));

//database conffiguration

var dbPath = "mongodb://localhost/Chat-Me";

//connect to database
db = mongoose.connect(dbPath);
mongoose.connection.once('open', function() {
    console.log("database Connection success");
});

//Session Store//
var MongoStore = require('connect-mongo')(session);


app.use(cookieParser());
app.use(flash());

var options = {
    url: dbPath
};

app.use(session({
    secret: 'ertfjnsmchgshoff',
    key: 'connect.sid',
    store: new MongoStore(options),
    cookie: { secure: false, maxAge: 86400000 },
    resave: false,
    saveUninitialized: false
}));
//App level middleware to flash messages and store current user from passportjs
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/app/views'));
app.use(express.static(__dirname));

//PassportJS setup
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());


//reading model files and requiering them using file system 
fs.readdirSync('./app/models').forEach(function(file) {
    if (file.indexOf('.js')) {
        require('./app/models/' + file);
    }
});

//reading model files and requiering them using file system
fs.readdirSync('./app/controllers').forEach(function(file) {
    if (file.indexOf('.js')) {
        var route = require('./app/controllers/' + file);
        route.controller(app);

    }
});

//===========//
//Socket.io
//===========//
require('./library/socket').socket(http);



//App level middleware for error handling
// Error handling middle-ware

app.use(function(err, req, res, next) {

    console.log(err.message);

    res.status(422).send({ error: err.message });
});

//error handle middleware when user enter a wrong url

app.use('*', function(req, res) {
    res.status(404).render("error404");
});




//Port setup 
http.listen(3000, function() {
    console.log('App running at port 3000');
});