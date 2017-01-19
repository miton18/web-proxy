const http = require('http');
const fetch = require('node-fetch');
const clog = console.log;

const self = {};
self.wait = true;
self.serverResult = [];
benchResult = [];
clog('#####################################');
clog('###           BENCHER             ###');
clog('#####################################');

let mockServer = http.createServer((req, res) => {
  if (!!req.headers['x-n']) {
    let n = req.headers['x-n'];
    self.serverResult[n] = Date.now();
    res.setHeader('x-n', n);
  }
  res.writeHead(200);
  res.end();
});

mockServer.listen(9999, () => {
  clog('Mocked server started');

  let n = 5;

  new Promise((resolve) => {
    for(let i = 0; i < n; i ++) {
      benchResult[i] = {};
      benchResult[i].start = Date.now();
      console.log('Request '+ n);

      fetch('http://test.local.dev/', {
        headers: {
          'x-n': i
        }
      }).then((res) => {
        let j = res.headers['x-n'];
        benchResult[j].end = Date.now();
        console.log('Response '+ n);
        if (j == n - 1) {
          resolve(benchResult);
        }
      });
      /*http.request({
        hostname: 'test.local.dev',
        path: '/',
        port: 80,
        headers: {
          'x-n': i
        }
      }, (res) => {
        res.on('data', (chunk) => {
          let j = res.headers['x-n'];
          benchResult[j].end = Date.now();
          console.log('Response '+ n);
          if (j == n - 1) {
            resolve(benchResult);
          }
        });
        res.on('end', () => {
          console.log('Response ended'+ n);
        });
      }).on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      }).end();*/
    }
  }).then((bench) => {
    console.log(bench);
  });
});
