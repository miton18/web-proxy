const express = require('express');
const http = require('http');
const protected = require('../utils/auth');
const Router = require('../router');
const Db = require('../utils/database');
const R = express.Router();

R.param('userName', (req, res, next, userName) => {
  Db.models.User.find({ username: userName}, (err, users) => {
    // Look for the first user only
    req.user = (err)? null : users[0]; 
    next();
  });
});

R.route('/')
.all(protected)
.get((req, res) => {
  Db.models.User.find({}, (err, users) => {
    
    if (err) res.json({
      err: err,
      user: null
    });
    
    else res.json({
      err: null,
      user: users
    });
  });
});

R.route('/:userName', (req, res) => {
  if (req.user) res.json({
    err: null,
    user: req.user
  });
  
  else res.json({
    err: 'User not found',
    user: null
  });
});

module.exports = R;