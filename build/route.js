(function() {
  var Route, db, mongo,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  db = require('./db');

  mongo = require('mongodb');

  module.exports = Route = (function() {
    function Route(arg) {
      var _id, ref, ref1, ref2, ref3, ref4, ref5;
      _id = (ref = arg._id) != null ? ref : null, this.subDomain = (ref1 = arg.subDomain) != null ? ref1 : '', this.destPort = (ref2 = arg.destPort) != null ? ref2 : -1, this.destHost = (ref3 = arg.destHost) != null ? ref3 : 'localhost', this.active = (ref4 = arg.active) != null ? ref4 : true, this.forwardSSL = (ref5 = arg.forwardSSL) != null ? ref5 : false;
      this.getLink = bind(this.getLink, this);
      this.toString = bind(this.toString, this);
      this["delete"] = bind(this["delete"], this);
      this.save = bind(this.save, this);
      console.log("new " + (this.toString()));
      if (_id != null) {
        this._id = new mongo.ObjectID(_id);
      }
    }

    Route.prototype.save = function(cb) {
      console.log("save Route " + this._id);
      return db((function(_this) {
        return function(err, db) {
          if (err != null) {
            return console.log(err);
          }
          return db.collection('route').save(_this, function(err, r) {
            return cb(err, r);
          });
        };
      })(this));
    };

    Route.prototype["delete"] = function(cb) {
      return db((function(_this) {
        return function(err, db) {
          if (err != null) {
            return console.log(err);
          }
          console.log("delete Route " + _this._id);
          return db.collection('route').deleteOne({
            _id: _this._id
          }, function(err, r) {
            return cb(err, r);
          });
        };
      })(this));
    };

    Route.prototype.toString = function() {
      return ("Route " + this._id + " ( " + this.subDomain + ", " + this.destPort + ", " + this.destHost + " ) ") + (this.active ? 'active' : 'inactive' + (this.forwardSSL ? 'SSL' : ''));
    };

    Route.prototype.getLink = function() {
      var ssl;
      ssl = this.forwardSSL ? 's' : '';
      return "http" + ssl + "://" + this.destHost + ":" + this.destPort;
    };

    return Route;

  })();

}).call(this);
