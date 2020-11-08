const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  userHelpers.getVehicles().then((vehicles)=>{
    console.log(vehicles);
    res.render('user/index',{vehicles,smess});
  })
});
let smess = {}
router.get('/about', function(req, res, next) {
  res.render('user/about', { title: 'Express' });
});
router.post('/usersignup',(req,res)=>{
  console.log(req.body,);
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);  
    res.json({status:true})
  })
  
})
router.get('/isuserexist/:user',(req,res)=>{
  console.log(req.params.user);
  userHelpers.isUserExist(req.params.user).then((response)=>{
    console.log(response);
    res.json(response)
  })
})

module.exports = router;
