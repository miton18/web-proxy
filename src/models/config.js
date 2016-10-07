let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Config model
 */
module.exports = mongoose.model("Config", new Schema({

  host: String,

  traceKey: String,
  traceName: String,
  traceActive: Boolean

}));

/*db.models.Config.find((err, confs) => {
  let conf = confs[0];
  conf.traceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3ZTU4NmIxZjE0ODhhMDBiMzkwYjcyMyIsImlhdCI6MTQ3NDY2MDAxN30.urxsBxRhNuA86keISxM-MNDMy3KikZH3UhpYv3rXsvg";
  conf.traceName = "PROXYDEV";
  conf.traceActive = true;
  conf.save(err => {
    console.log(err);
  });
});*/
