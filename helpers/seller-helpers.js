const { response } = require('express')
var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    sellerSignup:(details)=>{
        return new Promise(async(resolve,reject)=>{
            let isExistSeller=await db.get().collection(collection.SELLER_COLLECTION).findOne({fullname:details.fullname})
            console.log(isExistSeller)
            if(isExistSeller){
                console.log('seller exist');
                resolve({status:true})
            }else{
                details.password = await bcrypt.hash(details.password, 10)
            db.get().collection(collection.SELLER_COLLECTION).insertOne(details).then((data)=>{
                console.log(data.ops[0]);
                resolve(data.ops[0])
            })
            }
        })
    },
    sellerLogin:(sellerDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false 
            let response = {}
            let seller= await db.get().collection(collection.SELLER_COLLECTION).findOne({fullname:sellerDetails.fullname})
            if(seller){
                bcrypt.compare(sellerDetails.password,seller.password).then((status)=>{
                    if(status){
                        console.log('Login success');
                        response.seller=seller
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                        console.log('Login failed');
                    }
                })
            }else{
                console.log('error');
                resolve({status:false})
            }
        })
    },
    createFuel:(fuel)=>{
      
        return new Promise(async(resolve,reject)=>{
            let isExist={}
            let isFuelExist = await db.get().collection(collection.FUEL_COLLECTION).findOne({fuelname:fuel.fuelname})
            if(isFuelExist){
                isExist.status=true
                resolve(isExist)
            }else{
                db.get().collection(collection.FUEL_COLLECTION).insertOne(fuel).then((response)=>{
                    isExist.status=false
                    resolve(isExist)
                })
            }
            
        })
    },
    adddriver:(driverdetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DRIVER_COLLECTION).insertOne(driverdetails).then((response)=>{
                resolve(response)
            })
        })
    },
    getDriver:()=>{
        return new Promise(async(resolve,reject)=>{
            let drivers =await db.get().collection(collection.DRIVER_COLLECTION).find().toArray()
            resolve(drivers)
        })
    },
    driverDetails:(driverId)=>{
        return new Promise(async(resolve,reject)=>{
            let driverDetails=await db.get().collection(collection.DRIVER_COLLECTION).findOne({_id:objectId(driverId)})
            resolve(driverDetails)
        })
    },
    editdriver:(driverDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DRIVER_COLLECTION)
            .updateOne({_id:objectId(driverDetails.driverid)},{
                $set:{
                    drivername:driverDetails.drivername,
                    driveremail:driverDetails.driveremail,
                    driverphone:driverDetails.driverphone,
                    driverlicense:driverDetails.driverlicense,
                    driveraddress:driverDetails.driveraddress,
                }
            }).then((response)=>{
                resolve({status:true})
            })
        })
    }
}