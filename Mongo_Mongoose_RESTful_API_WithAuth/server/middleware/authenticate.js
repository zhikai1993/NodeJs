var {User} = require('./../models/user');

// token is stored in the web-brower header
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next(); // middleware next
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
