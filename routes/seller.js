const { response } = require('express');
var express = require('express');
var router = express.Router();
var sellerHelpers = require('../helpers/seller-helpers')
var vehicleHelpers = require('../helpers/vehicle-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/seller')
  }
}
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
    console.log(response);
    if (response.status) {
      res.redirect('/seller/seller-signup')
    } else {
      req.session.loggedIn = true
      req.session.seller = response
      res.render('seller/dashboard', { seller: req.session.seller })
    }

  })
})
router.post('/sellerlogin', (req, res) => {
  console.log(req.body);
  sellerHelpers.sellerLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.seller = response.seller
      console.log(req.session.seller);
      res.render('seller/dashboard', { seller: req.session.seller })
    } else {
      res.redirect('/seller')
    }
  })
})
let smess = {}
router.get('/create-fuel-type', verifyLogin, (req, res) => {
  let seller = req.session.seller

  res.render('seller/create-fuel-type', { seller, smess })


})

router.post('/add-fuel', verifyLogin, (req, res) => {

  sellerHelpers.createFuel(req.body).then((response) => {
    console.log(response)
    if (response.status) {
      smess.mess = "Alredy Exist"
    } else {
      smess.mess = "Fuel type added successfully"
    }

    res.redirect('/seller/create-fuel-type')
  })
})

router.get('/sellerlogout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/manage-fueltype', verifyLogin, (req, res) => {
  let seller = req.session.seller
  vehicleHelpers.getfuel().then((fuel) => {
    res.render('seller/manage-fueltype', { seller,fuel, "fuelresponsemessage":req.session.fuelresponsemessage,'fueldeleteresponsemessage':req.session.fueldeleteresponsemessage  })
  })
  req.session.fuelresponsemessage=null
  req.session.fueldeleteresponsemessage=null
})


router.get('/add-vehicle', verifyLogin, async (req, res) => {
  let seller = req.session.seller
  let fuel = await vehicleHelpers.getfuel()
  console.log(fuel);
  res.render('seller/add-vehicle', { seller, fuel, smess, "addvehicleresponsemessage": req.session.addvehicleresponsemessage })
  req.session.addvehicleresponsemessage = null
})


router.post('/add-vehicle', (req, res) => {
  let sellerId = req.session.seller._id
  vehicleHelpers.addVehicles(sellerId, req.body, req.files.Image1.name, req.files.Image2.name, req.files.Image3.name, req.files.Image4.name, req.files.Image5.name).then((id) => {

    let Image1 = req.files.Image1
    Image1.mv('./public/vehicle-images/' + id + req.files.Image1.name, (err, done) => {
      if (!err) {
        console.log('Image 1 inserted');
      } else {
        console.log(err);
      }
    })


    let Image2 = req.files.Image2
    Image2.mv('./public/vehicle-images/' + id + req.files.Image2.name, (err, done) => {
      if (!err) {
        console.log('Image 2 inserted');
      } else {
        console.log(err);
      }
    })


    let Image3 = req.files.Image3
    Image3.mv('./public/vehicle-images/' + id + req.files.Image3.name, (err, done) => {
      if (!err) {
        console.log('Image 3 inserted');
      } else {
        console.log(err);
      }
    })


    let Image4 = req.files.Image4
    Image4.mv('./public/vehicle-images/' + id + req.files.Image4.name, (err, done) => {
      if (!err) {
        console.log('Image 4 inserted');
      } else {
        console.log(err);
      }
    })


    let Image5 = req.files.Image5
    Image5.mv('./public/vehicle-images/' + id + req.files.Image5.name, (err, done) => {
      if (!err) {
        console.log('donImage 5 insertede');
      } else {
        console.log(err);
      }
    })
    if (response) {
      req.session.addvehicleresponsemessage = {
        type: "Success!",
        message: " Vehicle added successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
      res.redirect('/seller/add-vehicle',)
    } else {
      req.session.addvehicleresponsemessage = {
        type: "Error!",
        message: "Something went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
      res.redirect('/seller/add-vehicle',)
    }
  })
})
router.get('/manage-vehicle', verifyLogin, async (req, res) => {
  let seller = req.session.seller
  let vehicles = await vehicleHelpers.getVehicles(req.session.seller._id)
  console.log(vehicles);
  for(let i=0;i<vehicles.length;i++ ){
    if(vehicles[i].status==1){
      vehicles[i].notavailable=true
    }else if(vehicles[i].status == 0){
      vehicles[i].available=true
    }
  }
  res.render('seller/manage-vehicle', { vehicles, seller, "responsemessage": req.session.responsemessage,'driverdeleteresponsemessage':req.session.driverdeleteresponsemessage })
  req.session.responsemessage = null
  req.session.driverdeleteresponsemessage=null
})
router.get('/driver', verifyLogin, (req, res) => {
  let seller = req.session.seller
  res.render('seller/create-driver', { seller })
})

router.post('/add-driver', verifyLogin, (req, res) => {
  console.log(req.body);
  sellerHelpers.adddriver(req.body).then((response) => {

  })
  smess.mess = "Driver created successfully"
  res.redirect('/seller/driver')
})
router.get('/manage-driver', verifyLogin, async (req, res) => {
  let seller = req.session.seller
  let drivers = await sellerHelpers.getDriver()
  console.log(drivers);
  res.render('seller/manage-driver', { seller, drivers,"driverupdateresponsemessage":req.session.driverupdateresponsemessage })
  req.session.driverupdateresponsemessage=null
})
router.get('/edit-vehicle/:id', verifyLogin, async (req, res) => {
  let seller = req.session.seller
  console.log(req.params.id);
  let fuel = await vehicleHelpers.getfuel()
  let vehicle = await vehicleHelpers.getvehicleDetails(req.params.id)
  console.log(vehicle, "lllll");
  res.render('seller/edit-vehicle', { seller, vehicle, fuel })
})
router.post('/edit-vehicle', (req, res) => {
  console.log(req.body);
  vehicleHelpers.editVehicle(req.body, req.files.Image1.name, req.files.Image2.name, req.files.Image3.name, req.files.Image4.name, req.files.Image5.name).then((response) => {
    let Image1 = req.files.Image1
    Image1.mv('./public/vehicle-images/' + req.body.vid + req.files.Image1.name, (err, done) => {
      if (!err) {
        console.log('Image 1 inserted');
      } else {
        console.log(err);
      }
    })


    let Image2 = req.files.Image2
    Image2.mv('./public/vehicle-images/' + req.body.vid + req.files.Image2.name, (err, done) => {
      if (!err) {
        console.log('Image 2 inserted');
      } else {
        console.log(err);
      }
    })


    let Image3 = req.files.Image3
    Image3.mv('./public/vehicle-images/' + req.body.vid + req.files.Image3.name, (err, done) => {
      if (!err) {
        console.log('Image 3 inserted');
      } else {
        console.log(err);
      }
    })


    let Image4 = req.files.Image4
    Image4.mv('./public/vehicle-images/' + req.body.vid + req.files.Image4.name, (err, done) => {
      if (!err) {
        console.log('Image 4 inserted');
      } else {
        console.log(err);
      }
    })


    let Image5 = req.files.Image5
    Image5.mv('./public/vehicle-images/' + req.body.vid + req.files.Image5.name, (err, done) => {
      if (!err) {
        console.log('donImage 5 insertede');
      } else {
        console.log(err);
      }
    })

    req.session.responsemessage = {
      type: "Success!",
      message: " updated successfully",
      color: "#155724",
      backgroundcolor: "#d4edda"
    }
    res.redirect('/seller/manage-vehicle')

  })
})

router.get('/deleteVehicle/:vId', (req, res) => {
  vehicleHelpers.deleteVehicle(req.params.vId).then((response) => {
    console.log(response);
    if (response) {
      req.session.responsemessage = {
        type: "Success!",
        message: " Deleted successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
      res.json({ status: true })
    } else {
      req.session.responsemessage = {
        type: "Error!",
        message: "Something went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
      res.json({ status: false })
    }
  })
})

router.get('/edit-fuel/:id', verifyLogin, (req, res) => {
  let seller = req.session.seller
  vehicleHelpers.editFuel(req.params.id).then((fuel) => {
    res.render('seller/edit-fuel', { fuel, seller})
  })
})


router.post('/edit-fuel',verifyLogin,(req,res)=>{
  console.log(req.body);
  vehicleHelpers.updateFuel(req.body).then((response)=>{
    if(response.status){
      req.session.fuelresponsemessage = {
        type: "Success!",
        message: " Updated successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
    }else{
      req.session.fuelresponsemessage = {
        type: "Error!",
        message: "Alredy went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
    }
   res.redirect('/seller/manage-fueltype')
  })
})


router.get('/deleteFuel/:id',verifyLogin,(req,res)=>{
  vehicleHelpers.deletFuel(req.params.id).then((response)=>{
    if(response){
      req.session.fueldeleteresponsemessage = {
        type: "Success!",
        message: " Deleted successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
      res.json({ status: true })
    }else{
      req.session.fueldeleteresponsemessage = {
        type: "Error!",
        message: "Alredy went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
      res.json({ status: false })
    }
  })
})
router.get('/edit-driver/:id',verifyLogin,(req,res)=>{
  let seller =req.session.seller
  sellerHelpers.driverDetails(req.params.id).then((details)=>{
    res.render('seller/edit-driver',{details,seller})
  })
})
router.post('/edit-driver',verifyLogin,(req,res)=>{
  console.log(req.body);
  sellerHelpers.editdriver(req.body).then((response)=>{
    if(response.status){
      req.session.driverupdateresponsemessage = {
        type: "Success!",
        message: " Updated successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
      res.redirect('/seller/manage-driver')
    }else{
      req.session.driverupdateresponsemessage = {
        type: "Error!",
        message: "Something went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
    }
  })
})

router.get('/deletDriver/:id',(req,res)=>{
  sellerHelpers.deleteDriver(req.params.id).then((response)=>{
    if(response){
      req.session.driverdeleteresponsemessage = {
        type: "Success!",
        message: " Deleted successfully",
        color: "#155724",
        backgroundcolor: "#d4edda"
      }
      res.json({ status: true })
    }else{
      req.session.driverdeleteresponsemessage = {
        type: "Error!",
        message: "Alredy went wrong",
        color: "red",
        backgroundcolor: "#e38494"
      }
      res.json({ status: false })
    }
  })
})


router.get('/allbookings',verifyLogin,(req,res)=>{
  let seller=req.session.seller
  sellerHelpers.getallBookings(req.session.seller._id).then((allbookings)=>{
    console.log(allbookings);
    for (let i = 0; i < allbookings.length; i++) {
      console.log(allbookings[i].status);
      if (allbookings[i].status == 1) {
        allbookings[i].confirmed = true
      } else if (allbookings[i].status == 2) {
        allbookings[i].delivered = true
      } else if (allbookings[i].status == 3) {
        allbookings[i].cancelled = true
      } else {
        console.log("Error");
      }
    }
    console.log(allbookings);
    res.render('seller/allbookings',{seller,allbookings})
  })
})

router.get('/delivered/:id',verifyLogin,(req,res)=>{
  sellerHelpers.deliverVehicle(req.params.id).then((response)=>{
    if(response){
      res.json({status:true})
    }else{
      res.json({status:false})
    }
  })
})

router.get('/cancelBooking/:id',verifyLogin,(req,res)=>{
  sellerHelpers.cancelBooking(req.params.id).then((response)=>{
    if(response){
      res.json({status:true})
    }else{
      res.json({status:false})
    }
  })
})

router.get('/changestatus/:id',(req,res)=>{
  vehicleHelpers.changestatus(req.params.id).then((response)=>{
    if(response){
      res.json({status:true})
    }else{
      res.json({status:false})
    }
  })
})





module.exports = router;
