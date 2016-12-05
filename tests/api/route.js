/* const fetch = require('node-fetch');
const assert = require('assert');
const db = require('../../src/utils/database');

describe('API /api/route', function() {
  let jwt;
  let user;

  before(() => {
    return new Promise((resolve, reject) => {
      db
        .initialize()
        .then(() => {
          user = new db.models.User({
            username: 'test'
          });

          return user.setPassword('test');
        })

        .then((user) => {
          return user.generateJwt({}, Date.now() + 3600);
        })

        .then((token) => {
          resolve(jwt = token);
        })

        .catch(reject);
    });
  });

  after(() => {
    return new Promise((resolve, reject) => {
      user.remove((error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  });

  it('GET /api/route', () => {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8080/api/route', {
        headers: {
          authorization: `JWT ${jwt}`
        }
      })
        .then((result) => {
          assert.equal(result.status, 200, 'The request succeed');

          return result.json();
        })

        .then((json) => {
          assert(json instanceof Array, 'The response body is an Array');

          resolve();
        })

        .catch(reject);
    });
  });

  it('POST /api/route', () => {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8080/api/route', {
        method: 'POST',
        headers: {
          'authorization': `JWT ${jwt}`,
          'content-type': 'application/json'
        },

        body: JSON.stringify({
          host: '127.0.0.1',
          port: 8090,
          ssl: false,
          active: true
        })
      })

        .then((result) => {
          assert.equal(result.status, 200, 'The request succeed');

          return result.json();
        })

        .then((json) => {
          assert(json !== null, 'The route object');

          resolve();
        })

        .catch(reject);
    });
  });
}); */
