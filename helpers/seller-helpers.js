const { response } = require('express')
var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    sellerSignup:(details)=>{
        return new Promise(async(resolve,reject)=>{
            details.password = await bcrypt.hash(details.password, 10)
            db.get().collection(collection.SELLER_COLLECTION).insertOne(details).then((data)=>{
                console.log(data.ops[0]);
                resolve(data.ops[0])
            })
        })
    },
    sellerLogin:(sellerDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false 
            let response = {}
            let seller= await db.get().collection(collection.SELLER_COLLECTION).findOne({username:sellerDetails.username})
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
                console.log('user name exist');
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
    }
}