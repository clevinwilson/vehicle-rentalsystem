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
    createBrand:(brand)=>{
      
        return new Promise(async(resolve,reject)=>{
            let isExist={}
            let isBrandExist = await db.get().collection(collection.VEHICLE_BRANDS).findOne({brandname:brand.brandname})
            if(isBrandExist){
                isExist.status=true
                resolve(isExist)
            }else{
                console.log('hello');
                db.get().collection(collection.VEHICLE_BRANDS).insertOne(brand).then((response)=>{
                    isExist.status=false
                    resolve(isExist)
                })
            }
            
        })
    }
}