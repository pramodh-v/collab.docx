const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.get('/',async (req,res)=>{
    try{
        const all = User.find({});
        res.status(200).send(all);
    }
    catch{
        res.status(404).send({message:"No users found"});
    }
});
router.post('/register',async (req,res) => {
    const { username, password, email } = req.body;
    try{
        const user = await User.findOne({email:email});
        if(user){
            console.log(user);
            res.status(400).send({message:"User already exists",status:400});
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = new User({
                _id: uuidv4(),
                username: username,
                password: hashedPassword,
                email: email
            });
            await newUser.save();
            res.status(200).send({message:"User registered",status:200});
        }
    }
    catch(error){
        res.status(404).send({message:error,status:404});
    }
});
router.post('/login',async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email:email});
        if(!user){
            res.status(404).send({message:"User not found",status:404});
        }
        else{
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                res.status(400).send({message:"Invalid password",status:400});
            }
            else{
                const token = user.generateAuthToken();
                res.status(200).send({message:"User logged in",status:200,token:token,user:user});
            }
        }
    }
    catch{
        res.status(404).send({message:"User not found",status:404});
    }
});
module.exports = router;