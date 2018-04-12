//var socketio = require('socket.io');
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var passportSocketIo = require('passport.socketio');
var MongoStore = require('connect-mongo')(session);
var Chat = require('../app/models/chat');
var User = require('../app/models/user');

var dbPath = "mongodb://localhost/Chat-Me";
var options = {
    url: dbPath
};

//Event emitter setup
var events = require("events");
var eventsEmitter = new events.EventEmitter();
eventsEmitter.setMaxListeners(0);

module.exports.socket = function(http) {

    var io = require('socket.io')(http);


    var users = [];
    var AllUsers = [];

    //Socket io
    io
        .use(passportSocketIo.authorize({
            cookieParser: cookieParser, // the same middleware you registrer in express
            key: 'connect.sid', // the name of the cookie where express/connect stores its session_id
            secret: 'ertfjnsmchgshoff', // the session_secret to parse the cookie
            store: new MongoStore(options), //   using a sessionstore. 

        }))
        .on('connection', function(socket) {
            console.log('Connection started');




            socket.on('setUser', function(data) {

                eventsEmitter.emit('get-users');



                if (users.indexOf(data) < 0) {
                    users.push(data);
                    socket.userName = data;
                    socket.emit('userSet', { userName: data });
                    //message when a user joins

                    socket.broadcast.emit('userJoined', socket.userName);
                    eventsEmitter.on('all-users', function(allUsers) {
                        AllUsers = allUsers;

                        //Setting up user's online/offline status
                        AllUsers.forEach(function(user) {
                            if (users.indexOf(user.username) < 0) {

                                user.status = false;
                            } else {
                                user.status = true;
                            }
                        });

                        io.emit('userList', { OnlineUsers: users, AllUsers: AllUsers });
                    });


                } else {
                    socket.userName = data;
                    socket.emit('userSet', { userName: data });
                    //message when a user joins

                    socket.broadcast.emit('userJoined', socket.userName);
                    eventsEmitter.on('all-users', function(allUsers) {
                        AllUsers = allUsers;

                        //Setting up user's online/offline status
                        AllUsers.forEach(function(user) {
                            if (users.indexOf(user.username) < 0) {

                                user.status = false;
                            } else {
                                user.status = true;
                            }
                        });

                        io.emit('userList', { OnlineUsers: users, AllUsers: AllUsers });
                    });

                }
            });
            //===================//
            socket.on('privateroom', function(data) {
                socket.room = data;
                socket.join(data);
                //event to fetch old msg history
                eventsEmitter.emit('old-msg', socket.room);
            });




            //====================//

            //message is sent
            socket.on('msg sent to a private room', function(data) {

                io.in(data.room).emit('msg to a private room', data);
                eventsEmitter.emit('msg-data', data);
            });
            //chat history sent
            eventsEmitter.on('chat-history', function(data) {
                io.in(data.room).emit('chat-history', data);
            });
            //when user is typing
            socket.on('is typing', function(data) {
                // console.log(data);
                socket.broadcast.in(data.room).emit('typing', data);

            });

            //when user is not typing
            socket.on('not typing', function(data) {
                setTimeout(function() {
                    socket.broadcast.in(socket.room).emit('not typing', data);
                }, 1500);


            });
            //on disconnect
            socket.on('disconnect', function() {

                socket.broadcast.emit('userLeft', socket.userName + ' has logged out');
                users.splice(users.indexOf(socket.userName), 1);
                //event to get remaining users from db
                eventsEmitter.emit('get-users');
            });



        });

    eventsEmitter.on('msg-data', function(data) {
        var sentto = data.room.replace(data.user, '');
        data.to = sentto;
        data.from = data.user;
        delete data.user;
        Chat.create(data, function(err, chat) {
            if (err) {
                console.log(err);
            } else {

            }
        });


    });

    //Retrieving old messages from database
    eventsEmitter.on('old-msg', function(data) {
        Chat.find({ room: data }, function(err, chats) {
            if (err) {
                console.log(err);
            } else {
                var history = { room: data, chats: chats };
                eventsEmitter.emit('chat-history', history);
                //console.log(chats);
            }
        });
    });

    //Retrieving users from database
    eventsEmitter.on('get-users', function(data) {
        User.find({}, function(err, users) {
            if (err) {
                console.log(err);
            } else {

                eventsEmitter.emit('all-users', users);

            }
        });
    });
    return io;
};