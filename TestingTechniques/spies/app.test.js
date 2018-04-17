const expect = require('expect');
//rewire is the same with require whereas there are two more functions
// .__set__ and .__get__
// set will set the db object to be switch/replace by the the object we customized, in this case, we have the same name to imitately more closely
const rewire = require('rewire');

var app = rewire('./app');

describe('App', () => {
  var db = {
    saveUser: expect.createSpy()
  };
  app.__set__('db', db);

  it('should call the spy correctly', () => {
    var spy = expect.createSpy();
    spy('Andrew', 25);
    // this will return or assert true because line 17: spy was called and with the args specified
    expect(spy).toHaveBeenCalledWith('Andrew', 25);
  });

  it('should call saveUser with user object', () => {
    var email = 'andrew@example.com';
    var password = '123abc';

    //handleSignup's db is altered (refer above) and thus saveUser function is line 11.
    // THus this 'expect' returns true
    app.handleSignup(email, password);
    expect(db.saveUser).toHaveBeenCalledWith({email, password});
  });

});
