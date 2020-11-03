const { response } = require('express')
var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    sellerSignup:(details)=>{
        return new Promise(async(resolve,rejecr)=>{
            details.password = await bcrypt.hash(details.password, 10)
            db.get().collection(collection.SELLER_COLLECTION).insertOne(details).then((response)=>{
                resolve(response)
            })
        })
    }
}