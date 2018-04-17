var db = require('./db.js');

// let's assume the handleSignup function needs to take care a lot of things;
// this will make the testing hard, because this function may depend on calling other function
// BUT! We might only want to test the correctness of this function, not other functions it calls
// This is when the 'SPY' and 'Rewire' comes in
module.exports.handleSignup = (email, password) => {
  // Check if email already exists
  db.saveUser({email, password});
  // Send the welcome email
};
