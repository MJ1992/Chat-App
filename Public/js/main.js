var socket = io();

var room = {};
var send = document.querySelector('#send');
var input = document.querySelector('#Message');
var user = document.querySelector('#userName');
var chat = document.querySelector('#chat');
var currentUser = document.querySelector('#user');
var users = document.querySelector('#users');
var usersList = document.querySelector('#userList');
var pillsD = document.querySelector('#v-pills-tab');
var pillsContent = document.getElementById('v-pills-tabContent');


//caret up down
$(document).on('click', '.caret', function() {
    $(this).toggleClass('fa-caret-down fa-caret-up');
});



pillsD.addEventListener('click', function(e) {
    document.getElementById('card').style.display = "block";
    document.getElementById('start-chat').style.display = "none";
    var userOnline = e.target.innerText;
    var userHome = socket.userName;
    document.getElementById('Chatee').innerHTML = userOnline;

    if (userOnline < userHome) {
        room.value = userOnline + userHome;
    } else {
        room.value = userHome + userOnline;
    }
    socket.room = room.value;
    socket.emit('privateroom', room.value);

});


//Setting up the chat user
socket.emit('setUser', currentUser.textContent);
console.log(currentUser.textContent + ' joined');


socket.on('userSet', function(data) {
    document.getElementById('user').innerHTML = data.userName;
    socket.userName = data.userName;

    // socket.broadcast.emit('list', userName + 'has joined');

});
socket.on('userJoined', function(data) {

    if (data != undefined) {
        document.getElementById('joinee').innerHTML = data + ' has logged in';
    } else {
        document.getElementById('joinee').innerHTML = '';
    }
});

socket.on('userLeft', function(data) {
    if (data != undefined) {
        document.getElementById('joinee').innerHTML = data;
    } else {
        document.getElementById('joinee').innerHTML = '';
    }


});

//sending msg when hit on enter

input.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        send.click();
    }
});


//Sending msg when click on send button

send.addEventListener('click', function() {

    socket.emit('msg sent to a private room', {
        message: input.value,
        user: socket.userName,
        room: socket.room
    });
    input.value = '';
});

//when server emits the msg event
socket.on('msg to a private room', function(data) {
    var date = new Date(Date.now());
    date = date.toLocaleString('en-US');
    var newE = document.createElement('div');
    document.getElementById(data.room).appendChild(newE);
    newE.innerHTML = "<h5 class='user'>" + data.user + "</h5>" + "<p class='msg'>" + data.message + "</p>" + "<span class='date'>" + date + "</span>";
    if (socket.userName == data.user) {
        newE.className = 'text-right my-2  msgFrom w-75';
    } else {
        newE.className = 'text-left my-2  msgTo w-75';
    }


    //to keep the scroll bar at the bottom
    document.getElementById(data.room).scrollTop = document.getElementById(data.room).scrollHeight;
});


//typing
input.addEventListener('keydown', function() {

    socket.emit('is typing', { typist: socket.userName + ' is typing', room: socket.room });
});

//not typing
input.addEventListener('keyup', function() {
    socket.emit('not typing', '');
});
socket.on('typing', function(data) {
    if (socket.room == data.room) {
        document.getElementById('type').innerHTML = data.typist;
    }

});

socket.on('not typing', function(data) {
    document.getElementById('type').innerHTML = data;
});


//to display the retrieved  chat history
socket.on('chat-history', function(data) {

    document.getElementById(data.room).innerHTML = '';

    data.chats.forEach(function(chat) {

        var date = new Date(chat.createdAt).toLocaleString();
        var newEl = document.createElement('div');
        document.getElementById(data.room).appendChild(newEl);
        newEl.innerHTML = "<h5 class='user'>" + chat.from + "</h5>" + "<p class='msg'>" + chat.message + "</p>" + "<span class='date'>" + date + "</span>";
        if (socket.userName === chat.from) {
            newEl.className = ' text-right my-2  msgFrom w-75';
        } else {
            newEl.className = ' text-left my-2  msgTo w-75';
        }


        document.getElementById(data.room).scrollTop = document.getElementById(data.room).scrollHeight;

    });

});

socket.on('userList', function(data) {
    pillsD.innerHTML = '';

    //finding the user registered in db and listing them in users list in sidebar 
    data.AllUsers.forEach(function(user) {
        if (socket.userName !== user.username) {
            var room = '';
            if (currentUser.textContent < user.username) {
                room = currentUser.textContent + user.username;
            } else {
                room = user.username + currentUser.textContent;
            }

            //===============//
            var newEle = document.createElement('a');

            //if user is online then green dot and if offline then red dot
            if (user.status == true) {
                newEle.innerHTML = user.username + "<img class='status' src ='./Public/img/green-dot.png' >";
            } else {
                newEle.innerHTML = user.username + "<img class='status' src ='./Public/img/red-dot.png' >";
            }

            newEle.className = 'nav-link btn btn-dark chatUsers';
            newEle.setAttribute('href', '#' + room + '1');
            newEle.setAttribute('data-toggle', 'pill');
            newEle.setAttribute('role', 'tab');
            pillsD.appendChild(newEle);

            //------automatic room join---//
            socket.room = room;
            socket.emit('privateroom', room);
            //-------//


            //adding chat box //
            var CardBody = document.getElementById('card-body');
            var cardBody = document.createElement('div');
            if (document.querySelectorAll('#' + room).length == 0) {


                var ul = document.createElement('div');
                ul.className = "chatWindow conversation";
                ul.setAttribute('id', room);
                cardBody.appendChild(ul);
                var newElem = document.createElement('div');

                newElem.className = 'tab-pane fade ';
                newElem.setAttribute('id', room + '1');
                newElem.setAttribute('role', 'tabpanel');
                newElem.appendChild(cardBody);
                CardBody.appendChild(newElem);

            }
        }

    });

});