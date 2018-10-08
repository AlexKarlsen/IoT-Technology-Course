var express = require('express');
var router = express.Router();
var deviceController = require('../controllers/deviceController')
var baseurl = "/device";

router.route(baseurl + '/:id')
    .get(deviceController.getDeviceSetting);
    
module.exports = router;