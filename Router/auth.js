const router = require('express').Router()
const User = require('../Models/user');
const auth = require("../Midleware/userauth")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/configRagister.js')
const { check, validationResult } = require('express-validator');


// authrigestion by token 
router.get('/Auth',auth,async(req,res) =>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
      
    }catch(err){
        res.status(500).send('server error')
    }
})

// data validation 
const valid = [
    check('email','please inclde unique and valid email').isEmail(),
    check('passward','please enter the sward passward').exists()
]
// user authantication by email and passward
router.post('/auth', valid, async(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // Done validation 
    const{email,passward} = req.body;
    try{
        //see user exite
        let user = await User.findOne({email });
        if(!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]})
        }
        const isMatch= await bcrypt.compare(passward,user.passward);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]}) 
        }        
        //return jsonwebtoken
        const payload={
            user:{
                id:user._id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,
            {expiresIn:360000},(err,token)=>{
                if(err)throw err;
                res.json({token});
            });
    }
    catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
})
module.exports=router

