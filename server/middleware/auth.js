const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

module.exports = (req,res,next) => {
    const token = req.header('x-auth-token')||req.body.token||req.query.token;
    if(!token){
        return res.status(401).send({message:'No token provided'});
    }
    try{
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedToken;
    }
    catch(error){
        res.status(400).send(error);
    }
    return next();
}