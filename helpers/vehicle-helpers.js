var collection = require('../config/collection')
const db = require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
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
            let vehicle=await db.get().collection(collection.VEHICLES_COLLECTION).find().toArray()
            resolve(vehicle)
        })
    },
    getCars:()=>{
        return new Promise(async(resolve,reject)=>{
            let cars=await db.get().collection(collection.VEHICLES_COLLECTION).find({vehicletype:'car'}).toArray()
            console.log(cars);
            resolve(cars)
        })
    }
}