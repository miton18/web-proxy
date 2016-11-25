
let express = require('express');
let protected = require('./auth');
let Db = require('../db');

let R = express.Router();

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

module.exports = R;