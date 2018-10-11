require('dotenv').config();
var mqttHandler = require('../../mqttHandler');

var mqttClient = mqttHandler.getInstance();

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
      return res.status(200).json(result)
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
        var deviceId =  req.params.id
        var type = req.params.type;
        update = 'DesiredState.Threshold.' + type;
        collection.updateOne(
            { deviceId: deviceId},
            { $set: {
                [update]: req.body
                }
            },
            function (err, result) {
                if (err) throw err;
                var msgDev = { "type": type, "threshold": req.body }
                mqttClient.sendMessage("device/" + deviceId, JSON.stringify(msgDev));
                //console.log(result);
                db.close();
                return res.status(200).json({
                    message: "Threshold successfully updated"
                })
            }
        );
    });
};

exports.getDevices = function(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // Get the documents collection
        var collection = db.collection('deviceTwins');
        collection.find({}).toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          return res.status(200).json(result)
        });
    });
}

exports.deviceStream = function(req, res) {
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
    topic = 'report';
    client.subscribe(topic, function() {
      client.on('message', function(topic, msg, pkt) {
        //res.write("New message\n");
        var json = JSON.parse(msg);
        res.write("data: " + JSON.stringify(json) + '\n\n');
      });
    });
}