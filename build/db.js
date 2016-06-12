(function() {
  var mongo;

  mongo = require('mongodb').MongoClient;

  module.exports = function(cb) {
    return mongo.connect(process.env['PROXY-DB'], function(err, db) {
      return cb(err, db);
    });
  };

}).call(this);
