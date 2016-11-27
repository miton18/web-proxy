
const express = require('express');
const protected = require('../utils/auth');
const Db = require('../utils/database');
//const expressWs = require('express-ws');

const R = express.Router();
//  expressWs(R);

// equivalent to : /api/log/
R.route('/')
.all(protected)
.get((req, res) => {

  let now = new Date();

  /*Db.models.Log
  .find({
    timestamp: {
      $gte: now.setMinutes( now.getMinutes() - 10 )
    }
  });*/
  res.json({});

});

/*R.ws('/live', () => {

});*/

module.exports = R;