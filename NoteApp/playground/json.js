// var obj = {
//   name: 'Andrew'
// };
// var stringObj = JSON.stringify(obj);
// console.log(typeof stringObj);
// console.log(stringObj);

// var personString = '{"name": "Andrew","age": 25}';
// var person = JSON.parse(personString);
// console.log(typeof person);
// console.log(person);

const fs = require('fs');

var originalNote = {
  title: 'Some title',
  body: 'Some body'
};
var originalNoteString = JSON.stringify(originalNote); //convert an object to json type (all strings)
fs.writeFileSync('notes.json', originalNoteString); // this will overwrite all the contents with the second argument

var noteString = fs.readFileSync('notes.json');
var note = JSON.parse(noteString); //parse json type to object
console.log(typeof note);
console.log(note.title);
