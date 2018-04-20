/* env varaible has more possible values:
production(when the app is on remote such as Heroku)
development(when the app is being developed locally)
test(when the app is being tested locally)
*/

/* if not specified then assign it to development, because when you are running
  on Heroku, it will be assigned to production. If you are running test, you are
  probably running run "test-watch" in the command, that way 'test' is assigned to env
  and is not null. If you are just running the app, the env is not assigned, then it will
  be taken care of by the 'development'
*/
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
