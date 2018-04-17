const express = require('express'); // node js is envirnoment and express is a framework
const hbs = require('hbs'); //handlebars is like ejs, they are all view engines
const fs = require('fs'); // file system

const port = process.env.PORT || 3000; // setup the env variables because port is not stationary
var app = express();

hbs.registerPartials(__dirname + '/views/partials') //this folder creates hbs file that can be called or applied multiple times
app.set('view engine', 'hbs'); // set the express view engine to hbs.   note: two main functionality of hbs: partials, and registerHelper

//note: for middleware, we need to call next to finish current middleware and proceed to the next step; otherwise, the system is halted.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n');
  next();
});

// this middleware will let all requests to be render a maintenance page. And without calling next, the server will not response to any requests

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// there are three ways of render a page: res.send, use express.static, and res.render()
// for question about '__dirname', please refer to https://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// this helper function will be registered (stored) so that any hbs view can utilize this function
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// the second argument is an object, and all the properties in the object can be utilized directly in the rendered hbs files
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects'
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
