const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        Unique : true
    },
    passward : {
        type : String,
        required : true,
        Unique : true
    }
})

const  User = mongoose.model('user', userschema)
module.exports = User




