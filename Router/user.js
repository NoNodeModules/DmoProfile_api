const router = require('express').Router()
const gravatar = require("gravatar");
const { check, validationResult } = require('express-validator');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/configRagister.js')

const valid = [check (
    'name' , "name is required").not().isEmpty(),
    check('email','please inclde unique and valid email').isEmail(),
    check('passward','please enter the sward passward').isLength({min:6})
]

router.post('/user',valid, async(req,res)=>{
    const error = validationResult(req.body)

    if (!error.isEmpty()){
        res.status(400).json({error : error.array()})
    }
    const{ name,email,passward } = req.body;
    
    try{
        let user = await User.findOne({email});
                
        if (user){
            res.status(404).send({ "error":"user already exit"})
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            passward
        })
        
        const salt = await bcrypt.genSalt(10);
        user.passward = await bcrypt.hash(passward,salt)
        await user.save();

        const payload = {
            user:{
                id : user.id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,(err,token)=>{
                if(err)throw err;
                res.json({token});
            });
        await user.save();    
        res.send("user rgisered")
    }
    catch(err){
        console.error(err.message)
        res.status(500).send(error)
    }
})
module.exports = router;
