var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true, // take out the white space before and after the input
    minlength: 1
  }
});

module.exports = {User}
