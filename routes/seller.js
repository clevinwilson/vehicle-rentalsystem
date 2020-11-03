const { response } = require('express');
var express = require('express');
var router = express.Router();
var sellerHelpers =require('../helpers/seller-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('seller/seller-login')
});
router.get('/seller-signup',(req,res)=>{
  res.render('seller/seller-signup')
})
router.post('/sellersignup',(req,res)=>{
  console.log(req.body);
  sellerHelpers.sellerSignup(req.body).then((response)=>{
    console.log('data inserted');
  })
})
router.post('/sellerlogin',(req,res)=>{
  console.log(req.body);
  sellerHelpers.sellerLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.seller=response.seller
      console.log(req.session.seller);
      res.render('seller/create-brands')
    }else{
      res.render('seller/seller-login')
    }
  })
})





module.exports = router;
