const mqtt = require('mqtt');
const fs = require('fs');
require('dotenv').config();
telemetryController = require('./api/controllers/telemetryController');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = 'mongodb://user:iottech18@ds115353.mlab.com:15353/heroku_wrtwbw3g';

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
    let subscriptions = ["telemetry", "test"];

    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
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

    // mqtt subscriptions
    this.mqttClient.subscribe(subscriptions, { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      if (topic == subscriptions[0]) {
        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, db) {
          assert.equal(null, err);
          console.log("Connected successfully to server");
          // Get the documents collection
          var collection = db.collection('telemetry');
          // Insert some documents
          collection.insertOne(JSON.parse(message), function (err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
      }
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }
  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message);
  }
}
module.exports = MqttHandler;
