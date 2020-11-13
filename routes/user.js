const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')
var vehicleHelpers=require('../helpers/vehicle-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/')
  }
}
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
  let user=req.session.user
  res.render('user/about', { user});
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

router.get("/vehicle-details",async(req,res)=>{
    let user=req.session.user

  let vehicleDetails=await vehicleHelpers.getvehicleDetails("5fa8f619078b442728ef12ac")
  let vehicles=await vehicleHelpers.getsimilarVehicles()
  res.render('user/vehicle-details',{vehicleDetails,user,vehicles})
})
router.get('/profile',verifyLogin,(req,res)=>{
  let user=req.session.user
  userHelpers.getUserDetails(req.session.user._id).then((details)=>{
    console.log(details);
    res.render('user/profile',{details,user})
  })
  
})
router.get('/car-listing',(req,res)=>{
  let user=req.session.user
  vehicleHelpers.getCars().then((cars)=>{
    res.render("user/car-listing",{cars,user}) 
  })
})
router.get('/lcar-listing',async(req,res)=>{
  let user=req.session.user
  let lcars=await vehicleHelpers.getLcars()
  res.render('user/lcar-listing',{user,lcars})
})
router.get('/bike-listing',async(req,res)=>{
  let user=req.session.user
  let bikes=await vehicleHelpers.getBike()
  res.render('user/bike-listing',{bikes,user})
})
router.get('/scooter-listing',async(req,res)=>{
  let user=req.session.user
  let scooters=await vehicleHelpers.getScooter()
  res.render('user/scooter-listing',{scooters,user})
})
router.get('/bus-listing',async(req,res)=>{
  let user=req.session.user
  let buses=await vehicleHelpers.getBus()
  res.render('user/bus-listing',{buses,user})
})
router.get('/change-profile',verifyLogin,(req,res)=>{
  let user=req.session.user
  userHelpers.getUserDetails(req.session.user._id).then((details)=>{
    console.log(details);
    res.render('user/change-profile ',{details,user,"responsemessage":req.session.responsemessage})
    req.session.responsemessage=null
  })
})
router.post('/change-profile',verifyLogin,(req,res)=>{
  console.log(req.body);
  let user=req.session.user
  userHelpers.changeUserProfile(req.body).then((response)=>{
    if(response){
      req.session.responsemessage={
        type:"Success!",
        message:"Profile updated successfully",
        color:"#155724",
        backgroundcolor:"#d4edda"
      }
      res.redirect('/change-profile')
    }else{
      req.session.responsemessage={
        type:"Error!",
        message:"Profile updated successfully",
        color:"red",
        backgroundcolor:"#e38494"
      }
    }
  })
})
router.get('/update-password',(req,res)=>{
  let user=req.session.user
  let responsemessage=req.session.responsemessage
  res.render('user/update-password',{user,responsemessage})
  req.session.responsemessage=null
})
router.post('/update-password',(req,res)=>{
  console.log(req.body);
  userHelpers.updatePassword(req.session.user._id,req.body).then((response)=>{
    if(response.status){
      req.session.responsemessage={
        type:"Success!",
        message:"Password updated successfully",
        color:"#155724",
        backgroundcolor:"#d4edda"
      }
      res.redirect('/update-password')
    }else{
      req.session.responsemessage={
        type:"Error!",
        message:"Error",
        color:"red",
        backgroundcolor:"#e38494"
      }
      res.redirect('/update-password')
    }
  })
})

router.get('/contact',(req,res)=>{
  let user=req.session.user
  res.render('user/contact',{user})
})
router.get('/rating',(req,res)=>{
  console.log('rating');
  let user=req.session.user
  res.render('user/rating',{user})
})
router.post('/book',(req,res)=>{
  req.body.status=1
  console.log(req.body);
  userHelpers.bookNow(req.body).then((response)=>{
    res.redirect('/vehicle-details')
  })
})
router.get('/mybookings',(req,res)=>{
  let user=req.session.user
  userHelpers.getBookings(req.session.user._id).then((response)=>{
    res.render('user/mybookings',{user,response})
  })
 
})


module.exports = router;
