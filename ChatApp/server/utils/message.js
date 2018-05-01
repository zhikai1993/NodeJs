var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    //moment() returns the date and the value of will be the api for getting the value
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
