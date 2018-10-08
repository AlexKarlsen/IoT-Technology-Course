var express = require('express');
var router = express.Router();
var deviceController = require('../controllers/telemetryController')
var baseurl = "/telemetry";

router.route(baseurl + '/:id')
    .get(telemetryController.getTelemetry);
    
module.exports = router;