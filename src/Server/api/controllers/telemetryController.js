require('dotenv').config();

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = process.env.MONGO_URL;
var mqttHandler = require('../../mqttHandler');

var mqttClient = mqttHandler.getInstance();

exports.getTelemetry = function(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // Get the documents collection
        var collection = db.collection('telemetry');
        // Insert some documents
        collection.findOne({DeviceId: req.params.id}, function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          return res.send(result)
        });
      });
}

exports.getAllTelemetry = function(req, res) {
  MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      // Get the documents collection
      var collection = db.collection('telemetry');
      // Insert some documents
      collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return res.send(result)
      });
    });
}

exports.telemetryStream = function(req, res) {
  // send headers for event-stream connection
  // see spec for more information
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // Timeout timer, send a comment line every 20 sec
  var timer = setInterval(function() {
    res.write('event: ping' + '\n\n');
  }, 20000);
  var topic = 'telemetry';
  mqttClient.subscribe(topic, function() {
    mqttClient.on('message', function(topic, msg, pkt) {
      //res.write("New message\n");
      var json = JSON.parse(msg);
      res.write("data: " + JSON.stringify(json) + '\n\n');
    });
  });
}