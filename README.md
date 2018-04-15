# Chat-app
 A simple one-to-one chat application using socket.io,Node,ExpressJS and MongoDB
 
 Deployed on url : http://ec2-18-217-210-184.us-east-2.compute.amazonaws.com
 
## Technologies used
- Node.js
- ExpressJS
- MongoDB - To save User Info and Chat History
- EJS - Server Side Rendering Template
- Socket.io - For Websockets and real time communication
- Deployed on AWS EC2 Instance
- NGINX Web server 


## Steps to use App in browser
1. Go to url : `ec2-18-217-210-184.us-east-2.compute.amazonaws.com`
2. User has to login to use the app so user wil be redirected to `ec2-18-217-210-184.us-east-2.compute.amazonaws.com/login` page.
3. Login if you already have login creadentials otherwise click on sign up /register here link on login page
4. Register with user name,password and email and click on sign up
5. After login/Registering into app,user will be redirected to home page where all the other registered users  will be shown with their    online status
6. Click on the user to start the chat or see the chat history with that user (scrollup to see user chat history)
7. Click on Logout button to exit the app



## Steps to use app on local machine

#### Pre-requisite

- NodeJS is installed on your machine.
- MongoDB is installed on your machine.

## Steps to run app 
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

