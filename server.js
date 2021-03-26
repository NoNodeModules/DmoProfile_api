const express = require('express');
const bodyParser = require("body-parser");

const {dbConnect} = require('./config/configRagister');
const router = require('./Router/user');
const middleware = require('express-middleware');
const app = express();

dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router)
// app.use(check,validationResult);

app.listen(5000,()=>{ 
    console.log("listening on this 3000 port")
})

app.use('/api', user)
app.use('/api',auth)

// app.use('user',require('./Router/user'))
