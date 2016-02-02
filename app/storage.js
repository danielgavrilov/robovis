var Datastore = require("nedb");
var db = new Datastore({ filename: "./db/sessions", autoload: true });

exports.db = db;

exports.getAll = function(callback) {
  db.find({}, function(err, sessions) {
    if (err) console.error(err);
    callback(sessions);
  });
};

exports.save = function(session) {
  db.update({ _id: session._id }, session, { upsert: true });
};
