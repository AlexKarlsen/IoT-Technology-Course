const mqtt = require('mqtt');
const fs = require('fs');
require('dotenv').config();
telemetryController = require('./api/controllers/telemetryController');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = process.env.MONGO_URL

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = process.env.CLOUDMQTT_URL;
    this.options = {
      port: process.env.MQTT_PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    };
  }

  connect() {
    // Array of MQTT subscriptions
    let subscriptions = ["telemetry", "report", "test", "device/myDevice"];

    // Connect mqtt with credentials
    this.mqttClient = mqtt.connect(this.host, this.options);

    // Mqtt error callback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // Subscribe to required subscriptions
    this.mqttClient.subscribe(subscriptions, { qos: 0 });

    // When a message arrives handle it accordingly
    this.mqttClient.on('message', function (topic, message) {
      // If message is telemetry store the message in the telemetry db
      if (topic == subscriptions[0]) {
        console.log(JSON.parse(message));
        storeMessage(message)
      }
      else if (topic == subscriptions[1]){
        var msg = JSON.parse(message);
        MongoClient.connect(url, function (err, db) {
          assert.equal(null, err);
          console.log("Connected successfully to server");
          // Get the documents collection
          var collection = db.collection('deviceTwins');
          // update
          //update = 'ReportedState.Threshold.';
          console.log(msg)
          collection.updateOne(
              { deviceId: msg.DeviceId },
              { $set: {
                  "ReportedState": msg.ReportedState  
                  }
              },
              function (err, result) {
                  if (err) throw err;
                  console.log("Reported")
                  db.close();
              }
          );
      });
      }
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }
  // Sends a mqtt message to topic
  sendMessage(topic, message) {
    // Connect mqtt with credentials
    this.mqttClient = mqtt.connect(this.host, this.options);
    console.log("connected from send");
    this.mqttClient.publish(topic, message);
    console.log("message sent");
  }
}
function storeMessage(message){
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    // Get the documents collection
    var collection = db.collection('telemetry');
    // Insert some documents
    var msg = JSON.parse(message);
    collection.updateOne({ 
      DeviceId: msg.DeviceId
      },
      {
        $push: { TelemetryData: msg.TelemetryData }
      },
      {
        upsert: true
      },function (err, result) {
      if (err) throw err;
      db.close();
    });
  });
}
module.exports = MqttHandler;
