const { Db } = require("mongodb")
const { response } = require('express')
var collection = require('../config/collection')
const db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID


module.exports = {
    doLogin: (details) => {
        let loginStatus = true
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ adminname: details.adminname })
            if (admin) {
                bcrypt.compare(details.password, admin.password).then((status) => {
                    if (status) {
                        console.log("admin logedin");
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Error");
                        resolve({ status: false })
                    }
                })
            }else{
                console.log("admin not exist");
                resolve({status:false})
            }
        })
    },
    createCategory:(category)=>{
        return new Promise(async(resolve,reject)=>{
            let isExist=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({category:category.category})
            if(isExist){
                console.log('category alredy exist');
                resolve({status:true})
            }else{
                db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((response)=>{
                    resolve(response)
                })
            }
        })
    },
    getCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let category=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    },
    getRegSellers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SELLER_COLLECTION).find().toArray().then((sellers)=>{
                resolve(sellers)
            })
        })
    },
    getFeedbacks:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.FEEDBACK_COLLECTION).aggregate([
                {
                    $lookup:{
                        from:collection.USER_COLLECTION,
                        localField:'userId',
                        foreignField:'_id',
                        as:'user'
                    }
                },
                {
                    $project:{
                        message:1,user:{$arrayElemAt:['$user',0]}
                    }
                }
            ]).toArray().then((response)=>{
                resolve(response)
            })
        })
    }
}