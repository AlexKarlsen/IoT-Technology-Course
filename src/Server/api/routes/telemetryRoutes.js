var express = require('express');
var router = express.Router();
var telemetryController = require('../controllers/telemetryController')
var baseurl = "/telemetry";

router.route(baseurl)
    .get(telemetryController.getAllTelemetry)

router.route(baseurl + '/:id')
    .get(telemetryController.getTelemetry);

router.get(baseurl+ '/stream', function(req, res) {
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
    
        client.subscribe(topic, function() {
          client.on('message', function(topic, msg, pkt) {
            //res.write("New message\n");
        var json = JSON.parse(msg);
            res.write("data: " + JSON.stringify(json) + '\n\n');
          });
        });
      });
    
module.exports = router;