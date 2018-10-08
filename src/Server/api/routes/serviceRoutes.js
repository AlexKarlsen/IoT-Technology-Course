var express = require('express');
var router = express.Router();
var serviceController = require('../controllers/serviceController')
var baseurl = "/service";

router.route(baseurl + '/:id')
    .get(serviceController.getDeviceSetting);

router.route(baseurl + '/:id' + '/DesiredState/thresholds' + '/:type')
    .put(serviceController.updateDeviceSetting);
    
module.exports = router;