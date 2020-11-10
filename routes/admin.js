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
router.get('/create-category',verifyLogin,(req,res)=>{
  let admin=req.session.admin
  res.render('admin/create-category',{admin,"responsemessage":req.session.responsemessage})
  req.session.responsemessage=false
})
router.post('/create-category',verifyLogin,(req,res)=>{
  console.log(req.body);
  adminHelpers.createCategory(req.body).then((response)=>{
    if(response.status){
      req.session.responsemessage={
        type:"Error:",
        message:"Category alredy exist",
        color:"red",
        backgroundcolor:"#e3c5c5;"
      }
      res.redirect('/admin/create-category')
    }else{
      req.session.responsemessage={
        type:"Success!",
        message:"Category created successfully",
        color:"#155724",
        backgroundcolor:"#d4edda"
      }
    res.redirect('/admin/create-category')
    }
  })
})



module.exports = router;
