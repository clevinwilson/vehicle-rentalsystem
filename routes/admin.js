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
router.get('/dashboard',verifyLogin,async(req,res)=>{
  let admin=req.session.admin
  let sellercount=await adminHelpers.getSellersCount()
  let usercount=await adminHelpers.getUserCount()
  let bookingcount=await adminHelpers.getBookingsCount()
  let vehiclescount=await adminHelpers.getVehiclesCount()
  res.render('admin/dashboard',{admin,sellercount,usercount,bookingcount,vehiclescount})
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

router.get('/dashboard',verifyLogin,(req,res)=>{
  let seller=req.session.seller
  res.render('admin/dashboard',{seller})
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
router.get('/manage-category',verifyLogin,(req,res)=>{
  adminHelpers.getCategory().then((category)=>{
    console.log(category);
    let admin=req.session.admin
    res.render('admin/manage-category',{category,admin})
  })
})
router.get('/reg-sellers',verifyLogin,(req,res)=>{
  adminHelpers.getRegSellers().then((sellers)=>{
    
    console.log(sellers);
    res.render('admin/reg-sellers',{sellers,"admin":req.session.admin})

  })
})
router.get('/feedback',verifyLogin,(req,res)=>{
  let admin=req.session.admin
  adminHelpers.getFeedbacks().then((feedbacks)=>{
    console.log(feedbacks,'feedddd');
    res.render('admin/view-feedback',{feedbacks,admin})
  })
})
router.get('/editcategory/:id',verifyLogin,(req,res)=>{
  let admin=req.session.admin
  adminHelpers.getCategoryById(req.params.id).then((category)=>{
    res.render('admin/edit-category',{category,admin})
  })
})

router.post('/editcategory',(req,res)=>{
  adminHelpers.editCategory(req.body).then((response)=>{
    res.render('/admin/manage-category')
  })
})

router.get('/deleteCategory/:id',(req,res)=>{
  adminHelpers.deleteCategory(req.params.id).then((response)=>{
    if(response){
      res.json({status:true})
    }else{
      res.json({status:false})
    }
  })
  
})


module.exports = router;
