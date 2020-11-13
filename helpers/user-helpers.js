const { response } = require('express')
var collection = require('../config/collection')
const db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
module.exports = {
    getVehicles: () => {
        return new Promise((resolve, reject) => {
            let vehicles = db.get().collection(collection.VEHICLES_COLLECTION).find().limit(9).toArray()
            resolve(vehicles)
        })
    },
    doSignup: (userdetails) => {
        let isExist = {}
        return new Promise(async (resolve, reject) => {
            userdetails.password = await bcrypt.hash(userdetails.password, 10)
            let userExist = await db.get().collection(collection.USER_COLLECTION).findOne({ name: userdetails.name })
            console.log(userExist);
            if (userExist) {
                isExist.status = true
                resolve(isExist)
            } else {
                db.get().collection(collection.USER_COLLECTION).insertOne(userdetails).then((response) => {

                    resolve(response.ops[0])
                })
            }
        })
    },
    isUserExist: (username) => {
        return new Promise(async (resolve, reject) => {
            let isExist = null
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ name: username })
            console.log(user);
            if (user) {
                isExist = true
                resolve(isExist)
            } else {
                isExist = false
                resolve(isExist)
            }
        })
    },
    userLogin: (userloginDetails) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ name: userloginDetails.name })
            console.log(user);
            if (user) {
                bcrypt.compare(userloginDetails.password, user.password).then((status) => {
                    if (status) {
                        console.log('Login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('Login failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('not exist');
                resolve({ status: false })
            }
        })
    },
    getUserDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userDetails = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            console.log(userDetails);

            resolve(userDetails)

        })
    },
    changeUserProfile: (userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userDetails.id) }, {
                    $set: {
                        name: userDetails.fullname,
                        email: userDetails.emailid,
                        contactno: userDetails.mobilenumber,
                        address: userDetails.address
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    updatePassword: (userId, userPassword) => {
        return new Promise(async (resolve, reject) => {
            userPassword.newpassword = await bcrypt.hash(userPassword.newpassword, 10)
            console.log(userPassword.newpassword);
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            console.log(user);
            if (user) {
                console.log('user exist');
                bcrypt.compare(userPassword.newpassword, user.password).then((status) => {
                    if (status) {
                        console.log('password');
                        db.get().collection(collection.USER_COLLECTION)
                            .updateOne({ _id: Object(userId) }, {
                                $set: {
                                    password: userPassword.newpassword
                                }
                            }).then((response) => {
                                resolve({ status: true })
                            })
                    } else {
                        resolve({ status: false })
                    }
                })

            } else {
                resolve({ status: false })
            }
        })
    }
}