const express = require('express');
const bodyParser = require("body-parser");
const {dbConnect} = require('./config/configRagister');
const path = require('path')
const app = express();

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const auth = require("./Router/auth")
app.use(auth);

const router  = require('./Router/user');
app.use(router);

const profile = require("./Router/profile")
app.use(profile);

app.listen(5000,()=>{ 
    console.log("listening on this 3000 port")
})






















