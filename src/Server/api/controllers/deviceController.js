require('dotenv').config();

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = process.env.MONGO_URL;

exports.getDeviceSetting = function(req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    // Get the documents collection
    var collection = db.collection('deviceTwins');
    // Insert some documents
    collection.findOne({deviceId: req.params.id}, function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      return res.send(result)
    });
  });
};