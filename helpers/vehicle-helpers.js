var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID

module.exports={
    getBrands:()=>{
        return new Promise(async(resolve,reject)=>{
           let brands = await db.get().collection(collection.BRANDS_COLLECTION).find().toArray()
           resolve(brands)
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
        console.log(vehiclesdetails);
        db.get().collection(collection.VEHICLES_COLLECTION).insertOne(vehiclesdetails).then((data)=>{
            resolve(data.ops[0]._id)
        })
       })
    }
}