const { response } = require('express');
var express = require('express');
var router = express.Router();
var sellerHelpers = require('../helpers/seller-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/seller')
  }
}
let smess={mess:null}
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('seller/seller-login')
});
router.get('/seller-signup', (req, res) => {
  res.render('seller/seller-signup')
})
router.post('/sellersignup', (req, res) => {
  console.log(req.body);
  sellerHelpers.sellerSignup(req.body).then((response) => {
    console.log('data inserted');
  })
})
router.post('/sellerlogin', (req, res) => {
  console.log(req.body);
  sellerHelpers.sellerLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.seller = response.seller
      console.log(req.session.seller);
      res.render('seller/dashboard')
    } else {
      res.render('seller/seller-login')
    }
  })
})
router.get('/create-brands', verifyLogin, (req, res) => {
  let seller = req.session.seller
 
  res.render('seller/create-brands',{seller,smess})
  
})

router.post('/add-brands', verifyLogin, (req, res) => {

  sellerHelpers.createBrand(req.body).then((response) => {
    console.log(response)
    if(response.status){
      smess.mess="Alredy Exist"
    }else{
      smess.mess="Brand added successfully"
    }
    
    res.redirect('/seller/create-brands')
  })
})





module.exports = router;
