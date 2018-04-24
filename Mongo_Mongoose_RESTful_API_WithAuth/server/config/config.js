var env = process.env.NODE_ENV || 'development';

//if it is not deplyed the following code will return
//the reason why the followign code runs is due to development and test
//the purpose of the code is to set the process.env variables in a secure way
//thus we will not push the config.json file into github because the content in config.json is sensible
if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


//note: the "JWT_SECRET" is a secret code when hashing/encrypting so that
//we can keep the from tweaking by the spoofers.
