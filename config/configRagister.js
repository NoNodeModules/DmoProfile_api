const mongoose = require('mongoose');

const url =  { "mogoUrI" : "mongodb://localhost:27017/express-mongo-app",
    "jwtSecret" : "mysecrettoken"
}

console.log(url)
const dbConnect = async ()=>{
    mongoose.connect(url.mogoUrI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex : true

    }).then(()=>{
        console.log("connection is sucessfully with mongo-db")
    }).catch(()=>{
        console.log("error")
    })
}
module.exports = {dbConnect};






