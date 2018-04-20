//set up mongoose
var mongoose = require('mongoose');

//tell mongoose that we want to use the built-in library.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
