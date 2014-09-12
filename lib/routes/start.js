
'use strict';

var express = require('express');
var security = require('../security');
var router = express.Router();
//var models = require('../models');


router.get('/', function(req, res) {
    res.render("index", {"title": "dot-emc sample"});
});

module.exports = router;

