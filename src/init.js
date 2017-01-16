const Db  = require('./utils/database');
const Log = require('./utils/logger');

module.exports = () => {
  Log.info('[init] App initialisation...');

  // check for admin account
  Db.initialize().then(() => {
    Db.models.User.count({})
    .then( (userCount) => {
      Log.info('[init] [user] User creation :');

      if (userCount > 0) {
        return Log.info('[init] [user] SKIP users already exists');
      }

      Log.info('[init] [user] add Admin account');
      let user = new Db.models.User({
        username: '4dm1n',
        password: 'pr0xy-p455w0rd'
      });
      user.save( (err) => {
        if (err) {
          Log.error(err);
        } else {
          Log.info('[init] [user] Admin user created');
        }
      });
    }, (err) => {
      Log.error(err);
    }, () => {
      Log.error('Fail to connect DB');
    });
  });
};
