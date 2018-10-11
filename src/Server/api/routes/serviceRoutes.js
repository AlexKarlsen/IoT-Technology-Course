var express = require('express');
var router = express.Router();
var serviceController = require('../controllers/serviceController')
var baseurl = "/service";

router.route(baseurl + '/device')
    .get(serviceController.getDevices);

router.route(baseurl + '/device/:id')
    .get(serviceController.getDeviceSetting);

router.route(baseurl + '/device/:id' + '/DesiredState/thresholds' + '/:type')
    .put(serviceController.updateDeviceSetting);

router.route(baseurl + '/stream')
    .get(serviceController.deviceStream); 
    
module.exports = router;