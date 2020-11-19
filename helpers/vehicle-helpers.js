var collection = require('../config/collection')
const db = require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ObjectID } = require('mongodb')
const { enable } = require('debug')
var objectId = require('mongodb').ObjectID

module.exports = {
    getfuel: () => {
        return new Promise(async (resolve, reject) => {
            let fuel = await db.get().collection(collection.FUEL_COLLECTION).find().toArray()
            resolve(fuel)
        })
    },
    addVehicles: (sellerId, details, img1, img2, img3, img4, img5) => {
        return new Promise((resolve, reject) => {
            let vehiclesdetails = {}

            vehiclesdetails = details
            vehiclesdetails.img1 = img1
            vehiclesdetails.img2 = img2
            vehiclesdetails.img3 = img3
            vehiclesdetails.img4 = img4
            vehiclesdetails.img5 = img5
            vehiclesdetails.date = new Date()
            vehiclesdetails.seller = objectId(sellerId)
            vehiclesdetails.status=1
            console.log(vehiclesdetails);
            db.get().collection(collection.VEHICLES_COLLECTION).insertOne(vehiclesdetails).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    getVehicles: (sellerId) => {
        return new Promise(async (resolve, reject) => {
            let vehicles = await db.get().collection(collection.VEHICLES_COLLECTION).find({ seller: objectId(sellerId) }).limit(9).toArray()
            console.log(vehicles);
            resolve(vehicles)
        })
    },
    getvehicleDetails: (vid) => {
        return new Promise(async (resolve, reject) => {
            let vehicle = await db.get().collection(collection.VEHICLES_COLLECTION).findOne({ _id: objectId(vid) })
            console.log(vehicle);
            resolve(vehicle)
        })
    },
    getsimilarVehicles:()=>{
        return new Promise(async(resolve,reject)=>{
            let vehicle=await db.get().collection(collection.VEHICLES_COLLECTION).find().limit(4).toArray()
            resolve(vehicle)
        })
    },
    getCars:()=>{
        return new Promise(async(resolve,reject)=>{
            let cars=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:'car'}).toArray()
            console.log(cars);
            resolve(cars)
        })
    },
    getLcars:()=>{
        return new Promise(async(resolve,reject)=>{
            let Lcars=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:"lcar"}).toArray()
            resolve(Lcars)
        })
    },getBike:()=>{
        return new Promise(async(resolve,reject)=>{
            let bikes=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:"bike"}).toArray()
            resolve(bikes)
        })
    }
    ,getScooter:()=>{
        return new Promise(async(resolve,reject)=>{
            let scooters=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:"scooters"}).toArray()
            resolve(scooters)
        })
    },
    getBus:()=>{
        return new Promise(async(resolve,reject)=>{
            let buses=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:"bus"}).toArray()
            resolve(buses)
        })
    },
    editVehicle:(vehicleDetails,image1,image2,image3,image4,image5)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VEHICLES_COLLECTION)
            .updateOne({_id:objectId(vehicleDetails.vid)},{
                $set:{
                    vehiclename:vehicleDetails.vehiclename,
                    brandname:vehicleDetails.brandname,
                    vehicleoverview:vehicleDetails.vehicleoverview,
                    priceperday:vehicleDetails.priceperday,
                    fueltype:vehicleDetails.fueltype,
                    modelyear:vehicleDetails.modelyear,
                    seatingcapacity:vehicleDetails.seatingcapacity,
                    busdriver:vehicleDetails.busdriver,
                    cartype:vehicleDetails.cartype,
                    img1:image1,
                    img2:image2,
                    img3:image3,
                    img4:image4,
                    img5:image5
                    
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    deleteVehicle:(vehicleId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VEHICLES_COLLECTION).removeOne({_id:objectId(vehicleId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    editFuel:(fuelId)=>{
        return new Promise(async(resolve,reject)=>{
           let fuel =await db.get().collection(collection.FUEL_COLLECTION).findOne({_id:objectId(fuelId)})
           resolve(fuel)
        })
    },
    updateFuel:(details)=>{
        return new Promise(async(resolve,reject)=>{
            let fuel= await db.get().collection(collection.FUEL_COLLECTION).findOne({fuelname:details.fuelname})
            if(fuel){
                resolve({status:false})
            }else{
                db.get().collection(collection.FUEL_COLLECTION)
            .updateOne({_id:objectId(details.fuelid)},{
                $set:{
                    fuelname:details.fuelname
                }
            }).then((response)=>{
                resolve(response)
            })
            }
        })

    },
    deletFuel:(fuelId)=>{
        return new Promise((resolve,response)=>{
            db.get().collection(collection.FUEL_COLLECTION).removeOne({_id:objectId(fuelId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    changestatus:(vehicleId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VEHICLES_COLLECTION)
            .updateOne({_id:objectId(vehicleId)},{
                $set:{
                    status:0
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    blockbooking:(vehicleId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VEHICLES_COLLECTION)
            .updateOne({_id:objectId(vehicleId)},{
                $set:{
                    status:1
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    }
}