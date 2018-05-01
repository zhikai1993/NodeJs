var socket = io(); //this will

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child') //this is the css children syntax, referring the last element in the chat
  // Heights
  var clientHeight = messages.prop('clientHeight'); //the current view that is displayed
  var scrollTop = messages.prop('scrollTop'); // the top/history part of the messages
  var scrollHeight = messages.prop('scrollHeight'); // total height of all the messages
  var newMessageHeight = newMessage.innerHeight();  // the height of the recent came message
  var lastMessageHeight = newMessage.prev().innerHeight(); //the height of the previous message

  //algor to determine if automatically scroll to bottom
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
//socket.on   this function executes when someone enters the webpage or some socket emit
//            how to know which socket.on will be executed depends on the first function argument, this arg needs to match
//            the first argument can be customized like 'updateUserList' or built-in like 'connect'

//this is client/brower size, so when a new user enters specified url to the site, this will be executed.
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    //note the callack function (which is the third argument is not always in this form)
    //callback function usually is customized by programmer(please refer to server.js)
    if (err) {
      alert(err);
      // if an error, redirect to homepaage
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

//this is client/brower size, so when a new user closes the webpage this will be executed.
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//customized event listener for browser from server
socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

// this will run when server tells you it is time to receive an message
socket.on('newMessage', function (message) {
  //using moment.js to format the time
  var formattedTime = moment(message.createdAt).format('h:mm a');
  //this grabs the message container (empty container)
  var template = jQuery('#message-template').html();
  // this is enabled by moustache.js
  // the template is like a container and the we can pass in params like text,from,and createdAt by Mustache.render
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  //add the new message to 聊天框
  jQuery('#messages').append(html);
  scrollToBottom();
});

// this will run when server tells you it is time to receive an message
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

// this will run if someone in the brower click submit (text) button
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault(); //this prevents the page from getting reload

  //grab the input text entered by users
  var messageTextbox = jQuery('[name=message]');

  //send the request to server
  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    //this callback will set the textbox back to blank
    messageTextbox.val('')
  });
});


var locationButton = jQuery('#send-location');
// this will run if someone in the brower click sendLocation button (text)
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  //When Geolocation service is supported by browser, then when user clicks the sendLocation
  //we do not want the user to send again so that we need to set the 'attr' to be disabled
  //and we also change the text of the sendLocation button to Sending location...
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  //
  navigator.geolocation.getCurrentPosition(function (position) {
    //following code will run after the Geolocation service fetches the location
    //set the sendLocation button back to whatever it was
    locationButton.removeAttr('disabled').text('Send location');

    //tells the server that we have got a location to send to other users, do it!
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
