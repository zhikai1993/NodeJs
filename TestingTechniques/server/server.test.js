const request = require('supertest'); // supertest is a dependency that makes testing easy for express; it simplify the http request
const expect = require('expect'); //this works like assert, but it has more feature.

var app = require('./server').app; //require the app instance

describe('Server', () => {

  describe('GET /', () => {
    // the done is important because it ensures that the
    it('should return hello world response', (done) => {
      request(app)
        .get('/')
        .expect(404)
        .expect((res) => {
          expect(res.body).toInclude({
            error: 'Page not found.'
          });
        })
        .end(done);
    });
  });

  describe('GET /users', () => {
    it('should return my user object', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            name: 'Andrew',
            age: 25
          });
        })
        .end(done);
    });
  });
});
