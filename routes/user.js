const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  userHelpers.getVehicles().then((vehicles)=>{
    console.log(vehicles);
    res.render('user/index',{vehicles,smess,user});
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
    if(response.status){
      res.redirect('/')
    }else{
      res.json({status:true})
    }
    
  })
  
})
router.get('/isuserexist/:user',(req,res)=>{
  console.log(req.params.user);
  userHelpers.isUserExist(req.params.user).then((response)=>{
    console.log(response);
    res.json(response)
  })
})
router.post('/userlogin',(req,res)=>{
  userHelpers.userLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      console.log('user login faild');
      res.redirect('/')
    }
   
  })
  
})
router.get('/userLogout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
