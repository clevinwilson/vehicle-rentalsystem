var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID

module.exports={
    getfuel:()=>{
        return new Promise(async(resolve,reject)=>{
           let fuel = await db.get().collection(collection.FUEL_COLLECTION).find().toArray()
           resolve(fuel)
        })
    },
    addVehicles:(details,img1,img2,img3,img4,img5)=>{
       return new Promise((resolve,reject)=>{
        let vehiclesdetails={}
        vehiclesdetails=details
        vehiclesdetails.img1=img1
        vehiclesdetails.img2=img2
        vehiclesdetails.img3=img3
        vehiclesdetails.img4=img4
        vehiclesdetails.img5=img5
        vehiclesdetails.date=new Date()
        console.log(vehiclesdetails);
        db.get().collection(collection.VEHICLES_COLLECTION).insertOne(vehiclesdetails).then((data)=>{
            resolve(data.ops[0]._id)
        })
       })
    },
    getVehicles:()=>{
        return new Promise((resolve,reject)=>{
            let vehicles = db.get().collection(collection.VEHICLES_COLLECTION).find().limit(9).toArray()
            resolve(vehicles)
        })
    }
}