//built-in library in node.js and cleans and simply paths using the method join as follows:
//used to be: /users/zhikai/documents/Coding/somewhere/../Git
//to be:      /users/zhikai/documents/Coding/Git
//this can be checked out on line 14
const path = require('path');
//built-in library, this will helping creating a server
const http = require('http');
const express = require('express');
//this makes the frontend communicates with server
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
// this will crete our web-socket server
var io = socketIO(server);
var users = new Users();

// this will let the index.html be rendered under the path "publicPath" (remember there are three to render a webpage... see Mongo_Mongoose_RESTful_API in github)
app.use(express.static(publicPath));

/* io.emit()    emits message to all sockets
  socket.emit() emits message to one socket
  socket.broadcast.to() emits message to all sockets but itself

  note: there could be a argument inside the bracket of all three function
        the argument could be a 'room' that is a specifed property like string
        e.g.  io.emit(anyString) will only emit all people with anyString
*/

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room); //this create a space/container like a room
    users.removeUser(socket.id); //
    users.addUser(socket.id, params.name, params.room);

    //update every user in the room with new userList
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //update the welcoming message to new entered user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    //let other users know there is a new person/user entered room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    //callback function that let the caller function in chat.js to know whether there is an error or not
    callback();
  });

  //this runs when browser sends an 'createMessage' request
  socket.on('createMessage', (message, callback) => {
    //get thre user with the socket id
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      //post the message to all the users in the specifed chat room
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  //this runs when browser sends an 'createLocationMessage' request
  socket.on('createLocationMessage', (coords) => {
    //get thre user with the socket id
    var user = users.getUser(socket.id);

    if (user) {
      //post the location to all the users in the specifed chat room
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // when the socket is closed, erase the users information
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
