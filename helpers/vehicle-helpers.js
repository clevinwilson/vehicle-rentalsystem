var collection =require('../config/collection')
const db=require('../config/connection')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID

module.exports={
    getBrands:()=>{
        return new Promise(async(resolve,reject)=>{
           let brands = await db.get().collection(collection.BRANDS_COLLECTION).find().toArray()
           resolve(brands)
        })
    }
}