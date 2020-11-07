var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  userHelpers.getVehicles().then((vehicles)=>{
    console.log(vehicles);
    res.render('user/index',{vehicles});
  })
});
router.get('/about', function(req, res, next) {
  res.render('user/about', { title: 'Express' });
});

module.exports = router;
