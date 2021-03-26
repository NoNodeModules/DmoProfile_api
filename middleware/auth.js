const jwt = requiore('jsonwebtoken');
const config = require('../config/configRagister');

const auth = (req, res,next) => {
    const token = req.headers["x-auth-token"]
    if (!token)
        return res.status(401).json({ "error": "true", "msg": "no authentication token" })
        
    // varify token 
    try{
        const verifiedToken = jwt.verify("token", config.get('jwtSecret'));
        if (!verifiedToken){
            return res.status(401).json({ "error": "true", "msg": "token failed" })
        }
        req.user = verifiedToken._id
        next();
    }
    catch{
        res.status(401).send.json({"mess" : "token is not valid"});
    }
}
export default auth




