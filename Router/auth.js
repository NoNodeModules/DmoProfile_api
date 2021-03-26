const router = require('express').Router()
const auth =require('../middleware/auth') 
const { check, validationResult } = require('express-validator');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/configRagister.js');
const { default: auth } = require('../middleware/auth');
const { route } = require('./user');

router.get('auth', auth,async(req, res)=>{
    try{
        const user = await User.findById(req.user._id).select('-passward');
        res.json(user);
    }
    catch(err){
        console.log(err)
        res.status(500).send('server error')

    }
})

// post auth api
// authentik  user get & get token 

const valid = [check (
    'name' , "name is required").not().isEmpty(),
    check('email','please inclde unique and valid email'),
    check('passward','please enter the sward passward').isLength({min:6})
]

router.post('/user', valid, async(req,res,next)=>{
    console.log(req.body)
    const error = validationResult(req)
    if (!error.isEmpty()){
        res.status(400).send(error)
    }

    const{ name,email,passward } = req.body;
    try{
        let user = await User.findOne({email: req.body.email});
        if (user){
            res.status(404).send({ "error":"user already exit"})
        }
        const isMatch= await bycrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]}) 
        }

        const salt = await bcrypt.genSalt(10);
        user.passward = await bcrypt.hash(passward,salt)
        await user.save();

        // return jwt.JsonWebToken
        const payload = {
            user:{
                id : user.id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,{expires : 360000},
            (err,token)=>{
                if(err)throw err;
                res.json({token});
            });

        await user.save();    
        res.send("user rgisered")
    }
    catch(error){
        console.log(error.message)
        res.status(500).send(error)
    }
})
module.exports = router;


