# Chat-app
 A simple one-to-one chat application using socket.io,Node,ExpressJS and MongoDB
 
 Deployed on url : [https://vast-forest-85607.herokuapp.com/]
 
 ### Problem statement 
 
1. Create a simple one-to-one chat application using socket.io. This chat application should also capture the events like “other user is typing”.
2. This chat application should also identify the user that it typing. It should have login and logout feature, with proper notification to other user who is in the chat. Something like “Aditya has logged out”, “Aditya has joined the chat etc” 
3. The chat should be real time and using socket, but for storing the chat history between two people. It should use mongodb. So, store the chat of users into mongodb (along with their username) , so that this can be retrived later by user by scrolling up. (just like facebook messenger) 

### Solution

 - App Deployed on url : [https://vast-forest-85607.herokuapp.com/]

## Technologies used
- Node.js
- ExpressJS
- MongoDB - To save User Info and Chat History
- EJS - Server Side Rendering Template
- Socket.io - For Websockets and real time communication
- Deployed on AWS EC2 Instance
- NGINX Web server 


## Steps to use App in browser
1. Go to url : `[https://vast-forest-85607.herokuapp.com/]`
2. User has to login to use the app so user wil be redirected to `[https://vast-forest-85607.herokuapp.com/login]` page.
3. Login if you already have login creadentials otherwise click on sign up /register here link on login page
4. Register with user name,password and email and click on sign up
5. After login/Registering into app,user will be redirected to home page where all the other registered users  will be shown with their    online status
6. Click on the user to start the chat or see the chat history with that user (scrollup to see user chat history)
7. Click on Logout button to exit the app



## Steps to use app on local machine

#### Pre-requisite

- NodeJS is installed on your machine.
- MongoDB is installed on your machine.

### Steps to run and use app on local machine
1. Run mongo daemon using `mongod` command in mongoDB/bin directory
2. Download the repo into your local machine
3. In Terminal,go into project's directory and run command npm install
4. After all project dependencies are downloaded Run command `Node app.js`
5. In browser go to url `localhost:3000` to access the app.
6. User has to login to use the app so user wil be redirected to localhost:3000/login page.
7. Login if you already have login creadentials otherwise click on sign up /register here link on login page
8. Register with user name,password and email and click on sign up
9. After login/Registering into app,user will be redirected to home page where all the other registered users will be shown with their      online status
10. Click on the user to start the chat or see the chat history with that user (scrollup to see user chat history)
11. Click on Logout button to exit the app

