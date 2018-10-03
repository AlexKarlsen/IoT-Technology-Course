require('dotenv').config();
var mqttHandler = require('./mqttHandler');

var mqttClient = new mqttHandler();

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

exports.updateDeviceSetting = function(req, res) {
    console.log(req.body)
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // Get the documents collection
        var collection = db.collection('deviceTwins');
        // update
        deviceId =  req.params.id
        update = 'DesiredState.Threshold.' + req.params.type;
        collection.updateOne(
            { deviceId: deviceId},
            { $set: {
                [update]: req.body
                }
            },
            function (err, result) {
                if (err) throw err;
                mqttClient.sendMessage(deviceId, "twin update")
                console.log(result);
                db.close();
                return res.status(200).json({
                    message: "Threshold successfully updated"
                })
            }
        );
    });
};
