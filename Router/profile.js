const router = require('express').Router()
const gravatar = require("gravatar");
const auth = require("../Midleware/userauth")
const Profile = require('../Models/userprofile');
const { check, validationResult } = require('express-validator');

router.get('/Myprofile',auth,async(req,res)=>{
    try{
        const prof = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']
        )
        if (!prof){
            res.status(400).json({msg: "there is no profile for this user"});
        };
        res.json(prof)
    }

    catch(err){
        console.error(err.message); 
        res.status(500).send("server error")   
    }
})

// create the profile
router.post('/profile' ,auth,[
    check('status', "status is required").not().isEmpty(),
    check('skills', 'skill is required ').not().isEmpty()
],
    async(req,res)=>{      
        const error = validationResult(req);
        if (!error.isEmpty()){
            return res.status(400).json({error : error.array()});
        }
        const {
            company,
            websites,
            location,
            bio,
            status,
            githubUserName,
            skills,
            youtube, 
            facebook,
            instaagram,
            linkdin } = req.body

        const profilefield = {};
        profilefield.user = req.user.id;
        if(company) profilefield.company = company
        if(websites) profilefield.websites = websites
        if(location) profilefield.location = location
        if (bio)  profilefield.bio = bio
        if (status) profilefield.status = status
        if(skills){
            profilefield.skills = skills.split(',').map(skills=>skills.trim()
        );        
        console.log(profilefield.skills)

        profilefield.social = {}
        if(githubUserName) profilefield.social.githubUserName = githubUserName
        if(youtube) profilefield.social.youtube = youtube
        if(facebook) profilefield.social.facebook = facebook
        if (instaagram) profilefield.social.instaagram = instaagram
        if(linkdin) profilefield.social.linkdin = linkdin;
       
        // await save(profilefield)

        try{
            let profile= await Profile.findOne({user: req.user.id});
            if (profile){
                // update
                profile = await Profile.findOneAndUpdate(

                    {user: req.user.id},
                    {$set: profilefield},
                    {new : true}
                );
                // return res.json(profile)  
            }

            profile = new Profile (profilefield)
            res.json(profile)
            await profile.save();
        }
        catch(err){
            console.error(err);
            res.status(500).send('server Error')
        }
    }
})


// @get all profile 

router.get('/getAll',auth,async(req,res)=>{
    try{
        const prof = await Profile.find({user: req.params.user.id}).populate('user',['name','avatar']
        )
        if (!prof){
            res.status(400).json({msg: "there is no profile for this user"});
        };
        res.json(prof)
    }
    catch(err){
        console.error(err.message); 
        res.status(500).send("server error")   
    }
})

// delete the profile  
router.delete('/DeletePro',auth, async(req,res)=>{
    try {
    //Remove profile
    await profile.findOneAndRemove({ user: req.user.id });
    
    // Remove the user
    await user.findOneAndRemove({_id : req.user.id})
    }
    catch(err){
        console.error(message.err)
        res.json(' server error ')
    }
})
module.exports = router;











