require('./config/config'); // this will configure for the environment of the server. e.g. databasr Port

const _ = require('lodash'); // Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.
const express = require('express');
/*To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.

body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.

The middleware was a part of Express.js earlier but now you have to install it separately.

This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request. Install body-parser using NPM as shown below.*/
const bodyParser = require('body-parser');

//This will be used for validating the ObjectID
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // send using the object of todos to ensure the extentability
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id; //the id entered in the url is stored in the request parameters.

  // validate if the id is in correct form
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    // if there is no results, then return not found
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']); //use lodash to pick desired property from the request body

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // logic for control hte completedAt proprty at body variable
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  /* findByIdAndUpdate takes three arguments:
      the id to find, the mongo operator
  */
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

//port is defined from the configuration
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
