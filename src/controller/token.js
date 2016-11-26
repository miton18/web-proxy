const express = require('express');
const http = require('http');
const protected = require('../utils/auth');
const Router = require('../router');
const Db = require('../utils/database');
const R = express.Router();

R.post('/', (req, res) => {
  let body = {
    err: null,
    token: null
  };

  // check form fields exists
  if (req.body.username === undefined || req.body.password === undefined) { 
      body.err = "Please send a 'username' and a 'password'";
      res.json(401, body);
  }
  else {

    Db.models.User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err || !user) {
        Log.info(err || "user doesn't exist", req.body);
        body.err = "This username doesn't exist";
        return res.status(401).json(body);
      } 
      
      user.checkPassword(req.body.password).then(
        (isGoodPassword) => {
          if (!isGoodPassword) {
            body.err = 'Bad password';
            return res.json(401, body);
          } 
          body.token = user.generateJwt([], new Date().setHours( new Date().getHours() + 1 ) )
          res.json(body);
        },
        (err) => {
          body.err = err;
          res.json(body);
        }
      );
    });
  }
});

module.exports = R;