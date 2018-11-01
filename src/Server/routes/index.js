var express = require('express');
var mqtt = require('mqtt');
var router = express.Router();
var url = require('url');
require('dotenv').config();

var mqtt_url = process.env.CLOUDMQTT_URL;
var options = {
  port: process.env.MQTT_PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}

var client = mqtt.connect(mqtt_url, options);

/* GET home page. */
router.get('/test', function (req, res, next) {
  var config = url.parse(mqtt_url);
  config.topic = topic;
  res.render('index', {
    connected: client.connected,
    config: config
  });
});

client.on('connect', function () {
  router.post('/publish', function (req, res) {
    var msg = JSON.stringify({
      date: new Date().toString(),
      msg: req.body.msg
    });
    client.publish(topic, msg, function () {
      res.writeHead(204, { 'Connection': 'keep-alive' });
      res.end();
    });
  });

  router.get('/api/service/device/stream'), function (req, res) {
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function () {
      res.write('event: ping' + '\n\n');
    }, 20000);

    client.subscribe(topic, function () {
      client.on('message', function (topic, msg, pkt) {
        //res.write("New message\n");
        var json = JSON.parse(msg);
        res.write("data: " + JSON.stringify(json) + '\n\n');
      });
    });
  };

  router.get('/api/telemetry/stream', function (req, res) {
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function () {
      res.write('event: ping' + '\n\n');
    }, 20000);
    var topic = ["telemetry","report","alarm"];
    client.subscribe(topic, function () {
      client.on('message', function (topic, msg, pkt) {
        //res.write("New message\n");
        var json = JSON.parse(msg);
        res.write("data: " + JSON.stringify(json) + '\n\n');
      });
    });
  });
});

module.exports = router;
