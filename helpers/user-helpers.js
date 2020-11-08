const { response } = require('express')
var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID
module.exports={
    getVehicles:()=>{
        return new Promise((resolve,reject)=>{
            let vehicles = db.get().collection(collection.VEHICLES_COLLECTION).find().limit(9).toArray()
            resolve(vehicles)
        })
    }
}