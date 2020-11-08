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
    },
    doSignup:(userdetails)=>{
        let isExist={}
        return new Promise(async(resolve,reject)=>{
            let userExist=await db.get().collection(collection.USER_COLLECTION).findOne({name:userdetails.name})
            console.log(userExist);
            if(userExist){
                isExist.status=true
            }else{
                db.get().collection(collection.USER_COLLECTION).insertOne(userdetails).then((response)=>{
                    
                    resolve(response.ops[0])
                })
            }
        }) 
    },
    isUserExist:(username)=>{
        return new Promise(async(resolve,reject)=>{
            let isExist=null
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({name:username})
            console.log(user);
            if(user){
                isExist=true
                resolve(isExist)
            }else{
                isExist=false
                resolve(isExist)
            }
        })
    }
}