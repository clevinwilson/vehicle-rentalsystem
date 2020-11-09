const { response } = require('express');
var express = require('express');
var router = express.Router();
var adminHelpers=require('../helpers/admin-helpers')
const verifyLogin =(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/admin')
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-login')
});
router.get('/dashboard',verifyLogin,(req,res)=>{
  let admin=req.session.admin
  console.log(admin);
  res.render('admin/dashboard',{admin})
})
router.post('/adminlogin',(req,res)=>{
  console.log(req.body);
  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.admin=response.admin
      res.redirect('/admin/dashboard')
    }
  })
  
})



module.exports = router;
